#!/usr/bin/env node
const csvAccess = require('./csv-access');
const normalizeHelper = require('./normalize-helper');

main();

async function main() {
  const userInfos = await csvAccess.readFromStdin();

  normalizeHelper.normalizeCsvObject(userInfos);
  const filteredCsvObjects = normalizeHelper.filterOutRowsWithBadDates(userInfos);

  csvAccess.writeToStdout(filteredCsvObjects);
}
