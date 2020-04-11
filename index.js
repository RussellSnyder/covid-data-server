const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const { getDataGroupedByCountry: countryData1 } = require('./apis/covid-19-coronavirus-statistics');
const { getDataGroupedByCountry: countryData2 } = require('./apis/coronavirus-monitor');
const { normalizeCountryData } = require('./utils')

const app = express()
const port = 3000

app.get('/api/countries', (req, res) => {
  Promise.all([countryData1(), countryData2()]).then(function(values) {
    const [countryData1, countryData2] = values
    const normalizedCountryData = normalizeCountryData([countryData1, countryData2])

    res.json({
      overallCountryData: normalizedCountryData
    })
  });
});


app.listen(port, () => console.log(`corona data app listening at http://localhost:${port}`))