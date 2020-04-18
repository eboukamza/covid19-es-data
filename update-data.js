const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

let date = process.argv[2];

let dataPath = path.join(__dirname, 'data', date);
let dailyReport = fs.readFileSync(dataPath, 'utf-8');

const fileData = require('./datos-situacion');

const codes = [
  "ES.AN",
  "ES.AR",
  "ES.AS",
  "ES.PM",
  "ES.CN",
  "ES.CB",
  "ES.CM",
  "ES.CL",
  "ES.CT",
  "ES.CE",
  "ES.VC",
  "ES.EX",
  "ES.GA",
  "ES.MD",
  "ES.ME",
  "ES.MU",
  "ES.NA",
  "ES.PV",
  "ES.LO",
];

let dailyData = parse(dailyReport, {columns: ['name', 'cases','hospitalized','intensiveCare', 'deaths', 'recovered']})
  .map((elem, index) => {
    const {name, cases, deaths, recovered, cumulativeIncidence} = elem;
    return {
      date,
      name,
      code: codes[index],
      cases: parseInt(cases),
      deaths: parseInt(deaths),
      recovered: parseInt(recovered)
    }
  });

let total = dailyData.reduce((global, item) => ({
  ...global,
  cases: global.cases + item.cases,
  deaths: global.deaths + item.deaths,
  recovered: global.recovered + item.recovered,
}), {date, name: 'España', code: 'ES', cases: 0, deaths: 0, recovered: 0});

dailyData.push(total);

console.log(dailyData)
let outpath = path.join(__dirname, 'datos-situacion.json');
fileData.push(...dailyData);
fs.writeFileSync(outpath, JSON.stringify(fileData, null, 2));

fs.writeFileSync(path.join(__dirname, 'last-update'), new Date().toISOString());