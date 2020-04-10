const express = require('express')
const dotenv = require('dotenv');
dotenv.config();

const { getDataGroupedByCountry: countryData1 } = require('./apis/covid-19-coronavirus-statistics');

app.get('/', (req, res) => {
  Promise.all([countryData1()]).then(function(values) {
    // TODO use multiple sources of data and aggrigate here
    res.send(values)
  });
});

const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))