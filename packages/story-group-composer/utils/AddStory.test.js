import moment from 'moment-timezone';
import { getReadableDateFormat, getMomentTime } from './AddStory';

describe('Add Story Utils', () => {
  describe('getReadableDateFormat', () => {
    it('returns readable date with UTC timezone', () => {
      const objToSend = {
        uses24hTime: false,
        scheduledAt: 1569261207,
        timezone: 'America/Chicago',
      };
      const format = getReadableDateFormat(objToSend);
      expect(format).toEqual('Sep 23, 12:53 PM');
    });
    it('returns readable date with BST timezone and 24h time', () => {
      const objToSend = {
        uses24hTime: true,
        scheduledAt: 1569261207,
        timezone: 'Europe/London',
      };
      const format = getReadableDateFormat(objToSend);
      expect(format).toEqual('Sep 23, 18:53');
    });
  });
  describe('getMomentTime', () => {
    it('returns unix date with BST timezone', () => {
      const objToSend = {
        scheduledAt: 1569261207,
        timezone: 'Europe/London',
      };
      const format = getMomentTime(objToSend);
      const unixDate = moment.unix(objToSend.scheduledAt);
      const expectedFormat = unixDate.tz(objToSend.timezone);
      expect(format).toEqual(expectedFormat);
    });
    it('returns unix date without timezone', () => {
      const objToSend = {
        scheduledAt: 1569261207,
      };
      const format = getMomentTime(objToSend);
      const unixDate = moment.unix(objToSend.scheduledAt);
      expect(format).toEqual(unixDate);
    });
  });
  describe('getMomentTime when empty', () => {
    // Keep a fixed date
    beforeAll(() => {
      const dateSpy = jest.spyOn(moment, 'unix');
      dateSpy.mockReturnValue('+052207-02-16T12:57:35.000');
    });
    it('returns today unix date when scheduledAt is undefined', () => {
      const format = getMomentTime({
        scheduledAt: undefined,
      });
      const unixDate = moment.unix(Date.now());
      expect(format).toEqual(unixDate);
    });
    it('returns today unix date when scheduledAt is null', () => {
      const format = getMomentTime({
        scheduledAt: null,
      });
      const unixDate = moment.unix(Date.now());
      expect(format).toEqual(unixDate);
    });
  });
});
