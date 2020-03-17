const fs = require('fs');
const path = require('path');

let date = process.argv[2];

let dataPath = path.join(__dirname, 'data', date);
let dailyReport = fs.readFileSync(dataPath, 'utf-8');

const fileData = require('./datos-situacion');

const getYesterdayData = () => {
  const yesterday = process.argv[3];
  if (!yesterday) return;

  return fileData.filter(item => item.date === yesterday).reduce((data, item) => ({...data, [item.code]: item}), {});

};

const yesterdayData = getYesterdayData();

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

let dailyData = dailyReport.split('\n').map((elem, index) => {

  const [_, name, __, cases, deaths] = elem.match(/(\D*) ((\d*) (\d*))/);

  return {
    date,
    name,
    cases: parseInt(cases),
    deltaCases: !yesterdayData ? undefined : parseInt(cases) - yesterdayData[codes[index]].cases,
    deaths: parseInt(deaths),
    deltaDeaths: !yesterdayData ? undefined : parseInt(deaths) - yesterdayData[codes[index]].deaths,
    code: codes[index]
  }
});

let total = dailyData.reduce((global, item) => ({
  ...global,
  cases: global.cases + item.cases,
  deaths: global.deaths + item.deaths
}), {date, name: 'España', code: 'ES', cases: 0, deaths: 0});

if (yesterdayData) {
  total = {
    ...total,
    deltaCases: total.cases - yesterdayData[total.code].cases,
    deltaDeaths: total.deaths - yesterdayData[total.code].deaths
  }
}
dailyData.push(total);

console.log(dailyData)
let outpath = path.join(__dirname, 'datos-situacion.json');
fileData.push(...dailyData);
fs.writeFileSync(outpath, JSON.stringify(fileData, null, 2));
