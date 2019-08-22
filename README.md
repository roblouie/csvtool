## Project Setup

After checking out the project from github run the following command from the base project directory:
```
npm install
```

Since this project is designed as a command line tool, you must also run the following command to make the tool 
accessible on the command line:
```
npm install -g
```

The tool was tested in Windows 10 and OSX 10.14.4.

## Running the Tool
Run the tool with `csvtool`, passing in a csv file with stdin and naming an output file with stdout. A sample csv file 
is included with the project. You can test with this file like so: `csvtool < test.csv > result.csv`.

The included test csv file contains bad data in one of the dates, so you should see the output:
```
The date in row 1 contains invalid data and can't be parsed. This row will be dropped.
```

The file `result.csv` will also be created, with the first row dropped due to the bad data, but all other fields 
normalized

## Running Tests
Run unit tests with `npm test`. The test results should display as follows:

``` 
Normalize Helper
    normalizeCsvObject()
      ✓ normalizes the csv object sent in
    filterOutRowsWithBadDates()
      ✓ removes rows with unparsable dates and logs error to console
      
      
  2 passing (11ms)
```