import { timestampToHHMMSS, timestampToDDMMYYYY, ddmmyyyyToTimestamp } from '../../utils/time';

describe('Time Utility Tests', () => {
  describe('timestampToHHMMSS', () => {
    it('should convert positive timestamp to HH:MM:SS format', () => {
      // 1 hour, 30 minutes, 45 seconds = 5445000 milliseconds
      const timestamp = 5445000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('01:30:45');
    });

    it('should convert negative timestamp to negative HH:MM:SS format', () => {
      // -1 hour, -30 minutes, -45 seconds = -5445000 milliseconds
      const timestamp = -5445000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('-01:30:45');
    });

    it('should handle zero timestamp', () => {
      const timestamp = 0;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('00:00:00');
    });

    it('should handle small positive values (seconds only)', () => {
      // 45 seconds = 45000 milliseconds
      const timestamp = 45000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('00:00:45');
    });

    it('should handle minutes only', () => {
      // 30 minutes = 1800000 milliseconds
      const timestamp = 1800000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('00:30:00');
    });

    it('should handle hours only', () => {
      // 2 hours = 7200000 milliseconds
      const timestamp = 7200000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('02:00:00');
    });

    it('should handle large values (more than 24 hours)', () => {
      // 25 hours, 30 minutes, 15 seconds = 91815000 milliseconds
      const timestamp = 91815000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('25:30:15');
    });

    it('should pad single digits with zeros', () => {
      // 1 hour, 5 minutes, 7 seconds = 3907000 milliseconds
      const timestamp = 3907000;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('01:05:07');
    });

    it('should handle fractional seconds by truncating', () => {
      // 1.999 seconds = 1999 milliseconds
      const timestamp = 1999;
      const result = timestampToHHMMSS(timestamp);
      expect(result).toBe('00:00:01');
    });
  });

  describe('timestampToDDMMYYYY', () => {
    it('should convert timestamp to DD/MM/YYYY format', () => {
      // January 15, 2024
      const timestamp = new Date(2024, 0, 15).getTime();
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe('15/01/2024');
    });

    it('should handle single digit day and month with padding', () => {
      // March 5, 2024
      const timestamp = new Date(2024, 2, 5).getTime();
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe('05/03/2024');
    });

    it('should handle December (month 12)', () => {
      // December 31, 2023
      const timestamp = new Date(2023, 11, 31).getTime();
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe('31/12/2023');
    });

    it('should handle leap year February 29', () => {
      // February 29, 2024 (leap year)
      const timestamp = new Date(2024, 1, 29).getTime();
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe('29/02/2024');
    });

    it('should handle different years', () => {
      // July 4, 1776
      const timestamp = new Date(1776, 6, 4).getTime();
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe('04/07/1776');
    });

    it('should handle current year dates', () => {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const expectedDay = currentDate.getDate().toString().padStart(2, '0');
      const expectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const expectedYear = currentDate.getFullYear();
      const expected = `${expectedDay}/${expectedMonth}/${expectedYear}`;
      
      const result = timestampToDDMMYYYY(timestamp);
      expect(result).toBe(expected);
    });
  });

  describe('ddmmyyyyToTimestamp', () => {
    it('should convert DD/MM/YYYY string to timestamp', () => {
      const dateStr = '15/01/2024';
      const result = ddmmyyyyToTimestamp(dateStr);
      const expected = new Date(2024, 0, 15).getTime();
      expect(result).toBe(expected);
    });

    it('should handle single digit day and month', () => {
      const dateStr = '05/03/2024';
      const result = ddmmyyyyToTimestamp(dateStr);
      const expected = new Date(2024, 2, 5).getTime();
      expect(result).toBe(expected);
    });

    it('should handle December correctly', () => {
      const dateStr = '31/12/2023';
      const result = ddmmyyyyToTimestamp(dateStr);
      const expected = new Date(2023, 11, 31).getTime();
      expect(result).toBe(expected);
    });

    it('should handle leap year February 29', () => {
      const dateStr = '29/02/2024';
      const result = ddmmyyyyToTimestamp(dateStr);
      const expected = new Date(2024, 1, 29).getTime();
      expect(result).toBe(expected);
    });

    it('should handle historical dates', () => {
      const dateStr = '04/07/1776';
      const result = ddmmyyyyToTimestamp(dateStr);
      const expected = new Date(1776, 6, 4).getTime();
      expect(result).toBe(expected);
    });

    it('should be consistent with timestampToDDMMYYYY (round trip)', () => {
      const originalTimestamp = new Date(2024, 5, 15).getTime(); // June 15, 2024
      const dateStr = timestampToDDMMYYYY(originalTimestamp);
      const convertedTimestamp = ddmmyyyyToTimestamp(dateStr);
      
      // Both should represent the same date (but the time portion may differ)
      const originalDate = new Date(originalTimestamp);
      const convertedDate = new Date(convertedTimestamp);
      
      expect(originalDate.getFullYear()).toBe(convertedDate.getFullYear());
      expect(originalDate.getMonth()).toBe(convertedDate.getMonth());
      expect(originalDate.getDate()).toBe(convertedDate.getDate());
    });

    it('should handle edge cases correctly', () => {
      // Test first day of year
      const dateStr1 = '01/01/2024';
      const result1 = ddmmyyyyToTimestamp(dateStr1);
      const expected1 = new Date(2024, 0, 1).getTime();
      expect(result1).toBe(expected1);

      // Test last day of year
      const dateStr2 = '31/12/2024';
      const result2 = ddmmyyyyToTimestamp(dateStr2);
      const expected2 = new Date(2024, 11, 31).getTime();
      expect(result2).toBe(expected2);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between time format conversion functions', () => {
      const testTimestamps = [
        3661000, // 1:01:01
        0, // 00:00:00
        86399000, // 23:59:59
        90061000, // 25:01:01 (more than 24 hours)
      ];

      testTimestamps.forEach(timestamp => {
        const formatted = timestampToHHMMSS(timestamp);
        expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Should match HH:MM:SS pattern
      });
    });

    it('should maintain consistency between date format conversion functions', () => {
      const testDates = [
        '01/01/2024',
        '15/06/2023',
        '31/12/2025',
        '29/02/2024', // leap year
      ];

      testDates.forEach(dateStr => {
        const timestamp = ddmmyyyyToTimestamp(dateStr);
        const converted = timestampToDDMMYYYY(timestamp);
        expect(converted).toBe(dateStr);
      });
    });
  });
});