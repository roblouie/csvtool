#!/usr/bin/env node

const moment = require('moment');
const csvAccess = require('./csv-access');

main();

async function main() {
  const userInfos = await csvAccess.readFromStdin();

  userInfos.forEach(normalizeCsvObject);
  const filteredCsvObjects = userInfos.filter(filterOutRowsWithBadDates);

  csvAccess.writeToStdout(filteredCsvObjects);
}

function normalizeCsvObject(csvObject) {
  csvObject.Timestamp = convertTimestamp(csvObject.Timestamp);
  csvObject.FullName = csvObject.FullName.toUpperCase();
  csvObject.ZIP = csvObject.ZIP.padStart(5, '0');
  csvObject.FooDuration = convertDurationToSeconds(csvObject.FooDuration);
  csvObject.BarDuration = convertDurationToSeconds(csvObject.BarDuration);
  csvObject.TotalDuration = csvObject.FooDuration + csvObject.BarDuration;
}

function filterOutRowsWithBadDates(csvObject, index) {
  const isDateParsable = csvObject.Timestamp !== 'Invalid date';
  if (!isDateParsable) {
    console.error(`The date in row ${index + 1} contains invalid data and can't be parsed. This row will be dropped.`);
  }

  return isDateParsable;
}

function convertDurationToSeconds(duration) {
  return moment.duration(duration).asSeconds();
}

function convertTimestamp(timestampString) {
  const convertedTime = moment.parseZone(`${timestampString} -08:00`, 'M/D/YY h:mm:ss A Z', true).utcOffset('-05:00');
  return convertedTime.format();
}
