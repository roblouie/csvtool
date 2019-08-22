const assert = require('assert');
const sinon = require('sinon');
const moment = require('moment');

const normalizeHelper = require('./normalize-helper');

describe('Normalize Helper', function() {

  describe('normalizeCsvObject()', () => {
    it('normalizes the csv object sent in', () => {
      const FormattedDateReturn = '2004-10-02T11:44:11-05:00';

      sinon.stub(moment, 'duration').returns({asSeconds: () => 123.45});
      sinon.stub(moment, 'parseZone').returns({
        utcOffset: () => {
          return {
            format: () => '2004-10-02T11:44:11-05:00'
          }
        },
      });

      const csvObjects = [{
        Timestamp: '3/12/14 12:00:00 AM',
        FullName: 'test user',
        ZIP: '123',
        FooDuration: '00:02:03.45',
        BarDuration: '00:02:03.45',
        TotalDuration: 'abc123',
      }];

      normalizeHelper.normalizeCsvObject(csvObjects);
      const result = csvObjects[0];

      assert.equal(result.ZIP, '00123');
      assert.equal(result.FullName, 'TEST USER');
      assert.equal(result.FooDuration, 123.45);
      assert.equal(result.BarDuration, 123.45);
      assert.equal(result.TotalDuration, 246.9);
      assert.equal(result.Timestamp, FormattedDateReturn);
    });
  });

  describe('filterOutRowsWithBadDates()', () => {
    it('removes rows with unparseable dates and logs error to console', () => {
      const csvObjects = [
        {
          Timestamp: '3/12/14 12:00:00 AM',
          FullName: 'test user',
          ZIP: '123',
          FooDuration: '00:02:03.45',
          BarDuration: '00:02:03.45',
          TotalDuration: 'abc123',
        },
        {
          Timestamp: 'Invalid date',
          FullName: 'test user',
          ZIP: '123',
          FooDuration: '00:02:03.45',
          BarDuration: '00:02:03.45',
          TotalDuration: 'abc123',
        },
      ];

      const consoleLogSpy = sinon.stub(console, 'error');

      const filteredResults = normalizeHelper.filterOutRowsWithBadDates(csvObjects);

      assert(consoleLogSpy.calledOnce);
      assert(filteredResults.length, 1);
      assert.equal(filteredResults.find(result => result.Timestamp === 'Invalid date'), undefined);
    });
  });

});