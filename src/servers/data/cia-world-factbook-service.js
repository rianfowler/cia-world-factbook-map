const http = require('http');
const express = require('express');
const worldData = require('./cia-world-factbook-data.json');

const app = express();

const dataRouter = express.Router();

dataRouter.route('/countries.json')
	.get(function (req, res) {
		console.log('countries requested');
		res.json(Object.keys(worldData.countries).map((country) => country.replace(/_/g, " ")));
	});

dataRouter.route('/country/:name/details.json')
	.get(function (req, res) {
		console.log(req.params.name, ' requested');
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
		} = worldData.countries[req.params.name.replace(/ /g, "_")];
		console.log(latitude, longitude);

		const decimalLatitude = (latitude.degrees + (latitude.minutes / 60)) * (latitude.hemisphere === "N" ? 1 : -1);
		const decimalLongitude = (longitude.degrees + (longitude.minutes / 60)) * (longitude.hemisphere === "E" ? 1 : -1);
;
		res.json({
			country: req.params.name,
			location: [decimalLongitude, decimalLatitude],
			background
		});
	});

app.set('port', process.env.PORT || 3001);

app.use('/data', dataRouter);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

/*
		"china": {
			"data": {
				"name": "China",
				"introduction": {
					"background": "For centuries China stood as a leading civilization, outpacing the rest of the world in the arts and sciences, but in the 19th and early 20th centuries, the country was beset by civil unrest, major famines, military defeats, and foreign occupation. After World War II, the communists under MAO Zedong established an autocratic socialist system that, while ensuring China's sovereignty, imposed strict controls over everyday life and cost the lives of tens of millions of people. After 1978, MAO's successor DENG Xiaoping and other leaders focused on market-oriented economic development and by 2000 output had quadrupled. For much of the population, living standards have improved dramatically and the room for personal choice has expanded, yet political controls remain tight. Since the early 1990s, China has increased its global outreach and participation in international organizations."
				},
				"geography": {
					"location": "Eastern Asia, bordering the East China Sea, Korea Bay, Yellow Sea, and South China Sea, between North Korea and Vietnam",
					"geographic_coordinates": {
						"latitude": {
							"degrees": 35,
							"minutes": 0,
							"hemisphere": "N"
						},
						"longitude": {
							"degrees": 105,
							"minutes": 0,
							"hemisphere": "E"
						}
					},
					*/
