const forEach = require('lodash/forEach')

const equivalentCountries = {
  USA: 'US',
}

const normalizeCountryName = (countryName) => {
  if (!equivalentCountries[countryName]) {
    return countryName
  }

  return equivalentCountries[countryName]
}

exports.toNumber = (number) => parseFloat(number.replace(/,/g, ''));

exports.normalizeCountryData = (countryDataInput) => {
  // number of times data has been entered for a country
  const countriesDataSetCount = {};
  // sum of all data. Needs to be normalized by the countriesDataSetCount
  const summedCountriesData = {};
  // divid the summedCountryData by the countriesDataSetCount
  const normalizedCountryDataOutput = {};
  
  countryDataInput.forEach((dataSource) => {
    forEach(dataSource, ( countryData, countryName) => {
      let normalizedCountryName = normalizeCountryName(countryName);
      let countryDataSetCount = countriesDataSetCount[normalizedCountryName]
      let summedCountryData = summedCountriesData[normalizedCountryName]

      if (!countryDataSetCount) {
        countriesDataSetCount[normalizedCountryName] = 0
      } 
      if (!summedCountryData) {
        summedCountriesData[normalizedCountryName] = {
          confirmed: 0,
          deaths: 0,
          recovered: 0
        };
      }

      // if they were undefined, now they are not
      countryDataSetCount = countriesDataSetCount[normalizedCountryName]
      summedCountryData = summedCountriesData[normalizedCountryName]

      countriesDataSetCount[normalizedCountryName] = countryDataSetCount + 1
      summedCountriesData[normalizedCountryName] = {
        confirmed: summedCountryData.confirmed + countryData.confirmed,
        deaths: summedCountryData.deaths + countryData.deaths,
        recovered: summedCountryData.recovered + countryData.recovered
      }
    })
  })

  forEach(summedCountriesData, (sumCountryData, countryName) => {
    const countryDataSetCount = countriesDataSetCount[countryName]
    normalizedCountryDataOutput[countryName] = {
      confirmed: sumCountryData.confirmed / countryDataSetCount,
      deaths: sumCountryData.deaths / countryDataSetCount,
      recovered: sumCountryData.recovered / countryDataSetCount,
    }
  })

  return normalizedCountryDataOutput;
}