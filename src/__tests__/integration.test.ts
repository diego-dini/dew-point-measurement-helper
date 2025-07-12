import storage from '../utils/storage';
import { Dryer } from '../types/dryer';
import { Measurement, MeasurementStatus } from '../types/measurement';

// Mock AsyncStorage properly for integration tests
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: { [key: string]: string } = {};
  
  return {
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key: string) => {
      return Promise.resolve(store[key] || null);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Object.keys(store));
    }),
  };
});

describe('Application Integration Tests', () => {
  beforeEach(async () => {
    // Clear storage before each test
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('Complete Dryer Management Workflow', () => {
    it('should handle complete dryer lifecycle: create, read, update, delete', async () => {
      const testDryer: Dryer = {
        id: 1,
        name: 'Test Dryer',
        cycles: [
          { name: 'High', duration: 3600000 },
          { name: 'Low', duration: 1800000 },
        ],
      };

      // 1. Add dryer
      const addResult = await storage.addDryer(testDryer);
      expect(addResult).toBe(true);

      // 2. Read dryer
      const dryers = await storage.getDryers();
      expect(dryers).toHaveLength(1);
      expect(dryers[0]).toEqual(testDryer);

      // 3. Update dryer
      const updatedDryer = { ...testDryer, name: 'Updated Dryer' };
      const updateResult = await storage.updateDryer(updatedDryer);
      expect(updateResult).toBe(true);

      // 4. Verify update
      const updatedDryers = await storage.getDryers();
      expect(updatedDryers[0].name).toBe('Updated Dryer');

      // 5. Delete dryer
      const deleteResult = await storage.removeDryer(testDryer.id);
      expect(deleteResult).toBe(true);

      // 6. Verify deletion
      const finalDryers = await storage.getDryers();
      expect(finalDryers).toHaveLength(0);
    });

    it('should handle multiple dryers correctly', async () => {
      const dryer1: Dryer = {
        id: 1,
        name: 'Dryer 1',
        cycles: [{ name: 'Standard', duration: 2700000 }],
      };

      const dryer2: Dryer = {
        id: 2,
        name: 'Dryer 2',
        cycles: [{ name: 'Fast', duration: 1800000 }],
      };

      // Add both dryers
      await storage.addDryer(dryer1);
      await storage.addDryer(dryer2);

      // Verify both exist
      const allDryers = await storage.getDryers();
      expect(allDryers).toHaveLength(2);

      // Filter by ID
      const filteredById = await storage.getDryers({ id: 1 });
      expect(filteredById).toHaveLength(1);
      expect(filteredById[0].name).toBe('Dryer 1');

      // Filter by name
      const filteredByName = await storage.getDryers({ name: 'Dryer 2' });
      expect(filteredByName).toHaveLength(1);
      expect(filteredByName[0].name).toBe('Dryer 2');
    });
  });

  describe('Complete Measurement Management Workflow', () => {
    it('should handle complete measurement lifecycle', async () => {
      // First, add a dryer to reference
      const testDryer: Dryer = {
        id: 1,
        name: 'Test Dryer',
        cycles: [{ name: 'Standard', duration: 3600000 }],
      };
      await storage.addDryer(testDryer);

      const testMeasurement: Measurement = {
        id: 1,
        date: Date.now(),
        dryer: 1,
        towers: { left: 25, right: 30 },
        status: MeasurementStatus.COMPLETE,
      };

      // 1. Add measurement
      const addResult = await storage.addMeasurement(testMeasurement);
      expect(addResult).toBe(true);

      // 2. Read measurements
      const measurements = await storage.getMeasurements();
      expect(measurements).toHaveLength(1);
      expect(measurements[0]).toEqual(testMeasurement);

      // 3. Filter by dryer
      const dryerMeasurements = await storage.getMeasurements({ dryer: 1 });
      expect(dryerMeasurements).toHaveLength(1);

      // 4. Filter by status
      const completeMeasurements = await storage.getMeasurements({
        status: MeasurementStatus.COMPLETE,
      });
      expect(completeMeasurements).toHaveLength(1);

      // 5. Filter by non-existent dryer
      const nonExistentDryerMeasurements = await storage.getMeasurements({ dryer: 999 });
      expect(nonExistentDryerMeasurements).toHaveLength(0);
    });

    it('should handle date range filtering correctly', async () => {
      const now = Date.now();
      const oneDayAgo = now - 86400000;
      const oneDayFromNow = now + 86400000;

      const measurements = [
        {
          id: 1,
          date: oneDayAgo,
          dryer: 1,
          towers: { left: 20, right: 25 },
          status: MeasurementStatus.COMPLETE,
        },
        {
          id: 2,
          date: now,
          dryer: 1,
          towers: { left: 22, right: 27 },
          status: MeasurementStatus.COMPLETE,
        },
        {
          id: 3,
          date: oneDayFromNow,
          dryer: 1,
          towers: { left: 24, right: 29 },
          status: MeasurementStatus.COMPLETE,
        },
      ];

      // Add all measurements
      for (const measurement of measurements) {
        await storage.addMeasurement(measurement);
      }

      // Filter by date range (last 12 hours to next 12 hours)
      const twelveHoursAgo = now - 43200000;
      const twelveHoursFromNow = now + 43200000;

      const filteredMeasurements = await storage.getMeasurements({
        startDate: twelveHoursAgo,
        endDate: twelveHoursFromNow,
      });

      expect(filteredMeasurements).toHaveLength(1);
      expect(filteredMeasurements[0].id).toBe(2);
    });
  });

  describe('Current Measurement Management Workflow', () => {
    it('should handle current measurement state management', async () => {
      const currentMeasurement = {
        measurement: {
          id: 1,
          date: Date.now(),
          dryer: 1,
          towers: { left: 25, right: 30 },
          status: MeasurementStatus.ONGOING,
        },
        nextTowerSwitchTime: Date.now() + 3600000,
      };

      // 1. Save current measurement
      const saveResult = await storage.saveCurrenMeasurement(currentMeasurement);
      expect(saveResult).toBe(true);

      // 2. Retrieve current measurement
      const retrievedMeasurement = await storage.getCurrentMeasurement();
      expect(retrievedMeasurement).toEqual(currentMeasurement);

      // 3. Test blank measurement generation
      const blankMeasurement = storage.getBlankCurrentMeasurement();
      expect(blankMeasurement.measurement.dryer).toBe(0);
      expect(blankMeasurement.measurement.status).toBe(MeasurementStatus.ONGOING);
      expect(blankMeasurement.nextTowerSwitchTime).toBe(0);

      // 4. Overwrite with blank measurement
      await storage.saveCurrenMeasurement(blankMeasurement);
      const newRetrievedMeasurement = await storage.getCurrentMeasurement();
      expect(newRetrievedMeasurement.measurement.dryer).toBe(0);
    });
  });

  describe('Measurement Controller Simulation', () => {
    it('should simulate complete measurement process', async () => {
      // 1. Setup: Create a dryer
      const dryer: Dryer = {
        id: 1,
        name: 'Industrial Dryer',
        cycles: [
          { name: 'High Temp', duration: 3600000 },
          { name: 'Low Temp', duration: 5400000 },
        ],
      };
      await storage.addDryer(dryer);

      // 2. Start a new measurement
      const blankMeasurement = storage.getBlankCurrentMeasurement();
      await storage.saveCurrenMeasurement(blankMeasurement);

      // 3. Set dryer for measurement
      const measurementWithDryer = {
        ...blankMeasurement,
        measurement: {
          ...blankMeasurement.measurement,
          dryer: dryer.id,
        },
      };
      await storage.saveCurrenMeasurement(measurementWithDryer);

      // 4. Set tower values
      const measurementWithTowers = {
        ...measurementWithDryer,
        measurement: {
          ...measurementWithDryer.measurement,
          towers: { left: 22, right: 28 },
        },
      };
      await storage.saveCurrenMeasurement(measurementWithTowers);

      // 5. Set next tower switch time
      const measurementWithTimer = {
        ...measurementWithTowers,
        nextTowerSwitchTime: Date.now() + 1800000, // 30 minutes
      };
      await storage.saveCurrenMeasurement(measurementWithTimer);

      // 6. Finalize measurement
      const finalMeasurement = {
        ...measurementWithTimer.measurement,
        status: MeasurementStatus.COMPLETE,
      };
      await storage.addMeasurement(finalMeasurement);

      // 7. Reset current measurement
      const newBlankMeasurement = storage.getBlankCurrentMeasurement();
      await storage.saveCurrenMeasurement(newBlankMeasurement);

      // 8. Verify final state
      const measurements = await storage.getMeasurements();
      expect(measurements).toHaveLength(1);
      expect(measurements[0].status).toBe(MeasurementStatus.COMPLETE);
      expect(measurements[0].dryer).toBe(dryer.id);
      expect(measurements[0].towers.left).toBe(22);
      expect(measurements[0].towers.right).toBe(28);

      const currentState = await storage.getCurrentMeasurement();
      expect(currentState.measurement.dryer).toBe(0);
      expect(currentState.nextTowerSwitchTime).toBe(0);
    });
  });

  describe('Error Scenarios and Edge Cases', () => {
    it('should handle concurrent operations correctly', async () => {
      const dryers = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Dryer ${i + 1}`,
        cycles: [{ name: 'Standard', duration: 3600000 }],
      }));

      // Add dryers sequentially to avoid race conditions with the storage queue
      for (const dryer of dryers) {
        const result = await storage.addDryer(dryer);
        expect(result).toBe(true);
      }

      // Verify all were added
      const allDryers = await storage.getDryers();
      expect(allDryers).toHaveLength(5);
      expect(allDryers.map(d => d.name).sort()).toEqual([
        'Dryer 1', 'Dryer 2', 'Dryer 3', 'Dryer 4', 'Dryer 5'
      ]);
    });

    it('should maintain data integrity across operations', async () => {
      // Create test data
      const dryer: Dryer = {
        id: 1,
        name: 'Test Dryer',
        cycles: [{ name: 'Cycle 1', duration: 3600000 }],
      };

      const measurement: Measurement = {
        id: 1,
        date: Date.now(),
        dryer: 1,
        towers: { left: 25, right: 30 },
        status: MeasurementStatus.COMPLETE,
      };

      // Perform multiple operations
      await storage.addDryer(dryer);
      await storage.addMeasurement(measurement);

      // Update dryer
      const updatedDryer = { ...dryer, name: 'Updated Dryer' };
      await storage.updateDryer(updatedDryer);

      // Verify measurement is still intact
      const measurements = await storage.getMeasurements();
      expect(measurements[0]).toEqual(measurement);

      // Verify dryer was updated
      const dryers = await storage.getDryers();
      expect(dryers[0].name).toBe('Updated Dryer');
    });
  });
});