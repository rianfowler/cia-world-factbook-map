const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/worldDB', { useMongoClient: true});
mongoose.Promise = global.Promise;
const FuzzySet = require('fuzzyset.js');
const _get = require('lodash/get');

const worldData = require('./cia-world-factbook-data.json');
const topo = require('./world-110m.json');
const { feature } = require('topojson-client')

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
const Country = mongoose.model('country', countrySchema);

const worldSchema = new Schema({
	geography: {
		topojson: String
	}
});
const World = mongoose.model('World', worldSchema);

async function resetDatabase () {
	try {
		await World.remove({});
		await Country.remove({});
	} catch(e) {
		console.log('reset databse failed', e);
	}
}

async function addCountry({name, background, centerLatitude, centerLongitude}) {
	try {
		await Country.create({
			name,
			background,
			geography: {
				center: {
					latitude: centerLatitude,
					longitude: centerLongitude
				}
			}
		});
	} catch(e) {
		console.log('create country failed', e);
	}
};

async function initializeDatabase() {
	try {
		await resetDatabase();

		const countryNames = countryListFromFeatures(featuresFromTopo(topo));
		const ciaCountryKeys = countryListFromCia(worldData);

		const keys = matchKeys(ciaCountryKeys, countryNames);
		await Promise.all(keys.matches.map(async function(match) {
			const background = _get(worldData, `countries[${match.cia_key}].data.introduction.background`, 'No data available');
			await addCountry({
				name: match.geography_name,
				background: background,
				centerLatitude: 0,
				centerLongitude: 0
			});
		}));

		World.create({
			geography: {
				topojson: JSON.stringify(topo)
			}
		});

	} catch(e) {
		console.log('database initialization failed', e);
	}
}

function featuresFromTopo(topoObject) {
	return feature(topoObject, topoObject.objects[Object.keys(topoObject.objects)[0]]).features;
}

function countryListFromFeatures(features) {

	return features.map((feature) => {
		return feature.properties.NAME_LONG;
	});
}

function countryListFromCia(ciaData) {
	return Object.keys(ciaData.countries);
}

function matchKeys(cia, geography) {
	const worldFuzzy = FuzzySet(cia);
	let geographyMisses = [];
	const matches = geography.reduce((acc, next) => {
		const match = worldFuzzy.get(next);
		if (match[0][0] < 0.5) {
			geographyMisses.push(next);

			return acc;
		}

		acc.push({
			geography_name: next,
			cia_key: match[0][1]
		});

		return acc;
	}, []);

	const ciaMisses = cia.filter((ciaCountry) => {
		const value = matches.find((match) => {
			return match.cia_key === ciaCountry
		});
		return !value;
	});

	geographyMisses = geographyMisses.reduce((acc, miss) => {
		switch(miss) {
			case 'French Southern and Antarctic Lands':
				matches.push({
					geography_name: miss,
				});
				return acc;
			case 'Brunei Darussalam':
				matches.push({
					geography_name: miss,
					cia_key: 'brunei'
				});
				return acc;
			case 'Republic of the Congo':
				matches.push({
					geography_name: miss,
					cia_key: 'congo_republic_of_the'
				});
				return acc;
			case 'Northern Cyprus':
				matches.push({
					geography_name: miss
				});
				return acc;
			case 'Republic of Korea':
				matches.push({
					geography_name: miss,
					cia_key: 'korea_south'
				});
				return acc;
			case 'Lao PDR':
				matches.push({
					geography_name: miss,
					cia_key: 'laos'
				});
				return acc;
			case 'Myanmar':
				matches.push({
					geography_name: miss,
					cia_key: 'burma'
				});
				return acc;
			case 'Dem. Rep. Korea':
				matches.push({
					geography_name: miss,
					cia_key: 'korea_north'
				});
				return acc;
			case 'Russian Federation':
				matches.push({
					geography_name: miss,
					cia_key: 'russia'
				});
				return acc;
			default:
				acc.push(miss);
		}
	}, []);

	if (geographyMisses.length > 0)
		console.error('geography misses: ', geographyMisses);

	return {
		matches,
		ciaMisses,
		geographyMisses
	};
}

async function getCountriesData() {
	return await Country.find().exec();
}

async function getCountry(name) {
	return await Country.find({name});
}

module.exports = {
	getCountriesData,
	getCountry,
	initializeDatabase
};
