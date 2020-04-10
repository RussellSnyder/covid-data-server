const axios = require('axios');
const groupBy = require('lodash/groupBy');
const pick = require('lodash/pick');
const dotenv = require('dotenv');
dotenv.config();

const instance = axios.create({
  baseURL: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1',
  timeout: 1000,
	"headers": {
		"x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
		"x-rapidapi-key": process.env.API_KEY_CORONAVIRUS_STATISTICS,
  }
});

const getRelaventData = (data) => {
	if (!data) { return; }

	pick(data, ['confirmed', 'deaths', 'recovered'])
}

const getDataGroupedByCountry = async () => {
	const res = await instance.get('/stats');
	if (res.status !== 200) {
		console.error(res)
	}
	if (res.status === 200) {
		const { covid19Stats } = res.data.data;

		const groupByCountry = groupBy(covid19Stats, 'country')

		const aggrigateCountryRegions = {}; 

		Object.keys(groupByCountry).forEach(country => {
			const countryData = groupByCountry[country];

			if (countryData.length === 1) {
				aggrigateCountryRegions[country] = getRelaventData(countryData[0])
			}
			const aggrigate = countryData.reduce((total, currentValue) => {
				return {
					confirmed: total.confirmed + currentValue.confirmed,
					deaths: total.deaths + currentValue.deaths,
					recovered: total.recovered + currentValue.recovered,
				}
			}, {
				confirmed: 0,
				deaths: 0,
				recovered: 0
			})

			aggrigateCountryRegions[country] = aggrigate
		})

		return aggrigateCountryRegions
	}
}

exports.getDataGroupedByCountry = getDataGroupedByCountry
