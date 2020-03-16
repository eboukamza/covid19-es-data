const fs = require('fs');
const path = require('path');

let date = process.argv[2];

let dataPath = path.join(__dirname, 'data', date);
let dailyReport = fs.readFileSync(dataPath, 'utf-8');

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
    deaths: parseInt(deaths),
    code: codes[index]
  }
});

const total = dailyData.reduce((global, item) => ({
  ...global,
  cases: global.cases + item.cases,
  deaths: global.deaths + item.deaths
}), {date, name: 'España', code: 'ES', cases: 0, deaths: 0});
dailyData.push(total);


let outpath = path.join(__dirname, 'datos-situacion.json');
const fileData = JSON.parse(fs.readFileSync(outpath));
fileData.push(...dailyData);
fs.writeFileSync(outpath, JSON.stringify(fileData, null, 2));
