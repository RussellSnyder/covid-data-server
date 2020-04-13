const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors')

const { getDataGroupedByCountry: countryData1 } = require('./apis/covid-19-coronavirus-statistics');
const { getDataGroupedByCountry: countryData2, getCountryDataOverTime: overTime1 } = require('./apis/coronavirus-monitor');
const { normalizeCountryData } = require('./utils')

const app = express()
app.use(cors())

const port = process.env.PORT || 3000

app.get('/api/countries', (req, res) => {
  Promise.all([
    countryData1(),
    countryData2(),
  ]).then(function(values) {
    const [countryData1, countryData2] = values
    const normalizedCountryData = normalizeCountryData([countryData1, countryData2])

    res.json(normalizedCountryData)
  });
});

app.get('/api/country/:country', (req, res) => {
  const { country } = req.params

  Promise.all([
    overTime1(country),
  ]).then(function(values) {
    const [overTime1] = values
    res.json(overTime1)
  });
});

app.listen(port, () => console.log(`corona data app listening at http://localhost:${port}`))