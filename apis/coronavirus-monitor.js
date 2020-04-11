const axios = require('axios');
const omit = require('lodash/omit');
const groupBy = require('lodash/groupBy');
const forEach = require('lodash/forEach');
const { toNumber } = require('../utils');

const instance = axios.create({
  baseURL: 'https://coronavirus-monitor.p.rapidapi.com/coronavirus',
  timeout: 3000,
	"headers": {
		"x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
		"x-rapidapi-key": process.env.API_KEY,
  }
});

const getCountryDataOverTime = async (country) => {
	const res = await instance.get(`/cases_by_particular_country.php?country=${country}`);

	if (res.status !== 200) {
		console.error(res)
	}
	if (res.status === 200) {
		const { stat_by_country: stats } = res.data;
		const groupByDay = groupBy(stats, (stat) => stat.record_date.substring(0, 10))
		const oneADay = {}

		forEach(groupByDay, (value, key) => {
			const lastEntryIndex = value.length - 1
			oneADay[key] = value[lastEntryIndex]
		})

		return oneADay
	}
}

const getDataGroupedByCountry = async () => {
	const res = await instance.get('/cases_by_country.php');
	if (res.status !== 200) {
		console.error(res)
	}
	if (res.status === 200) {
		const { countries_stat } = res.data;

		const normalizedDataShape = {};
		countries_stat.forEach((country, i) => {
			// the first entry doesn't have a country name for some reason...
			if (i === 0) { return; }

			const key = country.country_name;

			country.confirmed = toNumber(country.cases);
			country.recovered = toNumber(country.total_recovered);
			country.deaths = toNumber(country.deaths);

			const normalizedCountry = omit(country, ['cases', 'country_name', 'total_recovered'])

			normalizedDataShape[key] = {
				...normalizedCountry
			}	
		})
		return normalizedDataShape
	}
}

exports.getDataGroupedByCountry = getDataGroupedByCountry
exports.getCountryDataOverTime = getCountryDataOverTime
