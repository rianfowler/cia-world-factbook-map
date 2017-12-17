const http = require('http');
const express = require('express');
const worldData = require('./cia-world-factbook-data.json');
const geometryData = require('./world-110m.json');
const FuzzySet = require('fuzzyset.js');
const { feature } = require('topojson-client')

const graphql = require('graphql');
const graphQLHTTP = require('express-graphql');
const {
	initializeDatabase,
	getCountry,
	getCountriesData
} = require('./database.js');

initializeDatabase();
let schema;

getCountriesData().then((countries) => {
	console.log(`${countries.length} countries retrieved`);
	/*
const countrySchema = new Schema({
	name: String,
	background: String,
	geography: {
		center: {
			latitude: Number,
			longitude: Number
		}
	}
});
*/
	const CenterType = new graphql.GraphQLObjectType({
		name: 'center',
		fields: function() {
			return {
				latitude: {
					type: graphql.GraphQLFloat
				},
				longiTude: {
					type: graphql.GraphQLFloat
				}
			}
		}
	});
	const GeographyType = new graphql.GraphQLObjectType({
		name: 'geography',
		fields: function() {
			return {
				center: {
					type: CenterType
				}
			};
		}
	});

	const CountryType = new graphql.GraphQLObjectType({
		name: 'country',
		fields: function () {
			return {
				name: {
					type: graphql.GraphQLString
				},
				background: {
					type: graphql.GraphQLString
				},
				geography: {
					type: GeographyType
				}
			};
		}
	});

	const queryType = new graphql.GraphQLObjectType({
		name: 'Query',
		fields: function () {
			return {
				countries: {
					type: new graphql.GraphQLList(CountryType),
					resolve: async function({name} = {}) {
						try {
							let countriesData;
							if (!name)
								countriesData = await getCountriesData();
							else
								countriesData = await getCountry(name);
							console.log('graphQL succeeded');
							return countriesData;
						} catch (e) {
							console.log('graphQL failed to retrieve data');
						}
					}
				}
			};
		}
	});

	schema = new graphql.GraphQLSchema({
		query: queryType
	});

	// const query = 'query { countries { background, name, ... on geography { ... on center{ latitude } } } }';
	const query = 'query { countries { name } }';

	graphql.graphql(schema, query).then((result) => {
		console.log(JSON.stringify(result,null, " "));
	});

});

const worldFactbookCountries = Object.keys(worldData.countries).map((country) => country.replace(/_/g, " "));
const worldFuzzy = FuzzySet(worldFactbookCountries);
let countries = [];

const geometryFeatures = feature(geometryData, geometryData.objects[Object.keys(geometryData.objects)[0]]).features;
// const geometryDataCountries = geometryFeatures.map((feature) => feature.properties.NAME_LONG);
// const geometryFuzzy = FuzzySet(geometryDataCountries);

geometryFeatures.forEach((feature) => {
	// console.log(`${feature.properties.NAME_LONG}: ${worldFuzzy.get(feature.properties.NAME_LONG)}`);
	countries.push(feature.properties.NAME_LONG);
	let key;
	switch(feature.properties.NAME_LONG) {
		case 'French Southern and Antarctic Lands':
		case 'Northern Cyprus':
		case 'Palestine':
			key = 'none';
			break;
		case 'Czech Republic':
			key = 'Czechia';
			break;
		case 'Falkland Islands':
			key = 'falkand islands isla malvinas';
			break;
		case 'The Gambia':
			key = 'gambia the';
			break;
		case 'Republic of Korea':
			key = 'korea south';
			break;
		case 'Myanmar':
			key = 'burma';
			break;
		case 'Dem. Rep. Korea':
			key = 'korea north';
			break;
		case 'Russian Federation':
			key = 'russia';
			break;
		default:
			// feature.properties.CIA_NAME = worldFuzzy.get(feature.properties.NAME_LONG)[0][1];
			key = worldFuzzy.get(feature.properties.NAME_LONG)[0][1];
	}
	if (key !== 'none') {
		worldData[feature.properties.NAME_LONG] = 'none';
	} else {
		worldData[feature.properties.NAME_LONG] = worldData[key];
		delete worldData[key];
	}
});

// move to server side and calculate there
function getMinMaxLatLong(coordinates) {
	return coordinates.reduce((accumulator, next) => {
		if (next.length !== 2) {
			const { minLat, maxLat, minLong, maxLong } = getMinMaxLatLong(next);
			return {
				minLat: Math.min(minLat, accumulator.minLat),
				maxLat: Math.max(maxLat, accumulator.maxLat),
				minLong: Math.min(minLong, accumulator.minLong),
				maxLong: Math.max(maxLong, accumulator.maxLong)
			}
		}
		return {
			minLat: Math.min(next[1], accumulator.minLat),
			maxLat: Math.max(next[1], accumulator.maxLat),
			minLong: Math.min(next[0], accumulator.minLong),
			maxLong: Math.max(next[0], accumulator.maxLong)
		}
	}, {minLat: 90, maxLat: -90, minLong: 180, maxLong: -180});
}

function zoomTest(geography) {
	const { minLat, maxLat, minLong, maxLong } = getMinMaxLatLong(geography.geometry.coordinates);

	const testZoom = Math.min(180 / (maxLat - minLat), 360 / (maxLong - minLong));
	const testCenter = [(maxLong - ((maxLong - minLong) /2)),(maxLat - ((maxLat - minLat) / 2))];

	return { testZoom, testCenter };
}

function getCountryGeometry(countryName) {
	const foundName = geometryFuzzy.get(countryName)[0][1];

	return geometryFeatures.filter((feature) => feature.properties.NAME_LONG === foundName)[0].geometry.coordinates;
}

const app = express();

const dataRouter = express.Router();

dataRouter.route('/countries.json')
	.get(function (req, res) {
		console.log('countries requested');
		res.json(worldFactbookCountries);
		// res.json(Object.keys(worldData.countries).map((country) => country.replace(/_/g, " ")));
	});

dataRouter.route('/geometries.json')
	.get((req, res) => res.json(geometryData));

dataRouter.route('/world.json')
	.get((req, res) => res.json({
		countries: countries,
		geometry: geometryData
	}));

dataRouter.route('/country/:name/details.json')
	.get(function (req, res) {
		console.log(req.params.name, ' requested');

		const fuzzyResult = worldFuzzy.get(req.params.name);

		if (fuzzyResult === null) {
			res.json({});
			return;
		}

		const fuzzyResultName = fuzzyResult[0][1].replace(/ /g, "_");

		const {
			data: {
				introduction: {
					background: background
				},
				geography: {
					geographic_coordinates: {
						latitude: latitude,
						longitude: longitude
					}
				}
			}
		} = worldData.countries[fuzzyResultName];
		// } = worldData.countries[req.params.name.replace(/ /g, "_")];
		;
		setTimeout(() => res.json({
			country: req.params.name,
			background
		}), 15);
	});

app.set('port', process.env.PORT || 3001);

app.use('/data', dataRouter);

app.use('/graph', graphQLHTTP({schema, pretty: true}));

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});


