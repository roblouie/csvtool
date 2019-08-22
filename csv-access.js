const readline = require('readline');
process.stdin.setEncoding('utf8');

const HEADERS = ['Timestamp', 'Address', 'ZIP', 'FullName', 'FooDuration', 'BarDuration', 'TotalDuration', 'Notes'];

module.exports = {
  readFromStdin,
  writeToStdout
};

function readFromStdin() {
  return new Promise(resolve => {
    const csvRows = [];

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', line => {
      csvRows.push(splitLineByComma(line));
    });

    rl.on('close', () => {
      resolve(csvRowsToObjects(csvRows));
    });
  });
}

function writeToStdout(csvObjects) {
  const csvLines = convertObjectsToCsv(csvObjects);
  csvLines.forEach(csvLine => {
    console.log(csvLine);
  });
}

function splitLineByComma(line) {
  return line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
  /* will match:

      (
          ".*?"       double quotes + anything but double quotes + double quotes
          |           OR
          [^",]+      1 or more characters excl. double quotes or comma
      )
      (?=             FOLLOWED BY
          \s*,        0 or more empty spaces and a comma
          |           OR
          \s*$        0 or more empty spaces and nothing else (end of string)
      )
  */
}

function csvRowsToObjects(csvRows) {
  const header = csvRows.splice(0, 1)[0];
  return csvRows.map(row => {
    const rowObject = {};

    row.forEach((column, index) => {
      rowObject[header[index]] = column;
    });

    return rowObject;
  });
}

function convertObjectsToCsv(csvObjects) {
  const csvData = [];

  csvData.push(HEADERS.join(','));

  csvObjects.forEach(csvObject => {
    const newArray = [];
    HEADERS.forEach(key => {
      newArray.push(csvObject[key]);
    });
    csvData.push(newArray.join(','));
  });

  return csvData;
}