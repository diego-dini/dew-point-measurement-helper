import storage from '../../utils/storage';
import { Dryer, DryerCycle } from '../../types/dryer';
import { Measurement, MeasurementStatus } from '../../types/measurement';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Storage Utility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dryer Management', () => {
    const mockDryer: Dryer = {
      id: 1,
      name: 'Test Dryer',
      cycles: [
        { name: 'Cycle 1', duration: 3600000 }, // 1 hour
        { name: 'Cycle 2', duration: 1800000 }, // 30 minutes
      ],
    };

    it('should add a new dryer successfully', async () => {
      // Mock empty dryers list
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(true);

      const result = await storage.addDryer(mockDryer);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'dryers',
        JSON.stringify([mockDryer])
      );
    });

    it('should not add dryer with duplicate id', async () => {
      // Mock existing dryer with same id
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockDryer]));

      const result = await storage.addDryer(mockDryer);

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should update existing dryer', async () => {
      const updatedDryer = { ...mockDryer, name: 'Updated Dryer' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockDryer]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(true);

      const result = await storage.updateDryer(updatedDryer);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'dryers',
        JSON.stringify([updatedDryer])
      );
    });

    it('should not update non-existent dryer', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const result = await storage.updateDryer(mockDryer);

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should remove existing dryer', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockDryer]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(true);

      const result = await storage.removeDryer(mockDryer.id);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('dryers', JSON.stringify([]));
    });

    it('should not remove non-existent dryer', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const result = await storage.removeDryer(999);

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should get all dryers', async () => {
      const mockDryers = [mockDryer];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDryers));

      const result = await storage.getDryers();

      expect(result).toEqual(mockDryers);
    });

    it('should get dryers filtered by id', async () => {
      const mockDryers = [mockDryer, { ...mockDryer, id: 2, name: 'Dryer 2' }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDryers));

      const result = await storage.getDryers({ id: 1 });

      expect(result).toEqual([mockDryer]);
    });

    it('should get dryers filtered by name', async () => {
      const mockDryers = [mockDryer, { ...mockDryer, id: 2, name: 'Dryer 2' }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockDryers));

      const result = await storage.getDryers({ name: 'Test Dryer' });

      expect(result).toEqual([mockDryer]);
    });

    it('should handle legacy cicles property and convert to cycles', async () => {
      const legacyDryer = {
        id: 1,
        name: 'Legacy Dryer',
        cicles: [{ name: 'Cycle 1', duration: 3600000 }],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([legacyDryer]));

      const result = await storage.getDryers();

      expect(result).toEqual([
        {
          id: 1,
          name: 'Legacy Dryer',
          cycles: [{ name: 'Cycle 1', duration: 3600000 }],
        },
      ]);
    });
  });

  describe('Measurement Management', () => {
    const mockMeasurement: Measurement = {
      id: 1,
      date: Date.now(),
      dryer: 1,
      towers: { left: 25, right: 30 },
      status: MeasurementStatus.COMPLETE,
    };

    it('should add a new measurement successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(true);

      const result = await storage.addMeasurement(mockMeasurement);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'measurement-history',
        JSON.stringify([mockMeasurement])
      );
    });

    it('should not add measurement with duplicate id', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockMeasurement]));

      const result = await storage.addMeasurement(mockMeasurement);

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should get all measurements', async () => {
      const mockMeasurements = [mockMeasurement];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockMeasurements));

      const result = await storage.getMeasurements();

      expect(result).toEqual(mockMeasurements);
    });

    it('should get measurements filtered by dryer id', async () => {
      const measurements = [
        mockMeasurement,
        { ...mockMeasurement, id: 2, dryer: 2 },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(measurements));

      const result = await storage.getMeasurements({ dryer: 1 });

      expect(result).toEqual([mockMeasurement]);
    });

    it('should get measurements filtered by status', async () => {
      const measurements = [
        mockMeasurement,
        { ...mockMeasurement, id: 2, status: MeasurementStatus.CANCELED },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(measurements));

      const result = await storage.getMeasurements({ status: MeasurementStatus.COMPLETE });

      expect(result).toEqual([mockMeasurement]);
    });

    it('should get measurements filtered by date range', async () => {
      const now = Date.now();
      const measurements = [
        { ...mockMeasurement, id: 1, date: now - 86400000 }, // 1 day ago
        { ...mockMeasurement, id: 2, date: now }, // now
        { ...mockMeasurement, id: 3, date: now + 86400000 }, // 1 day from now
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(measurements));

      const result = await storage.getMeasurements({
        startDate: now - 43200000, // 12 hours ago
        endDate: now + 43200000, // 12 hours from now
      });

      expect(result).toEqual([{ ...mockMeasurement, id: 2, date: now }]);
    });
  });

  describe('Current Measurement Management', () => {
    const mockCurrentMeasurement = {
      measurement: {
        id: 1,
        date: Date.now(),
        dryer: 1,
        towers: { left: 25, right: 30 },
        status: MeasurementStatus.ONGOING,
      },
      nextTowerSwitchTime: Date.now() + 3600000, // 1 hour from now
    };

    it('should save current measurement', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(true);

      const result = await storage.saveCurrenMeasurement(mockCurrentMeasurement);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'current-measurement',
        JSON.stringify(mockCurrentMeasurement)
      );
    });

    it('should handle save current measurement error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.saveCurrenMeasurement(mockCurrentMeasurement);

      expect(result).toBe(false);
    });

    it('should get current measurement', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockCurrentMeasurement));

      const result = await storage.getCurrentMeasurement();

      expect(result).toEqual(mockCurrentMeasurement);
    });

    it('should return blank measurement when no current measurement exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.getCurrentMeasurement();

      expect(result.measurement.status).toBe(MeasurementStatus.ONGOING);
      expect(result.measurement.dryer).toBe(0);
      expect(result.measurement.towers.left).toBe(0);
      expect(result.measurement.towers.right).toBe(0);
      expect(result.nextTowerSwitchTime).toBe(0);
    });

    it('should generate blank current measurement with valid structure', () => {
      const blankMeasurement = storage.getBlankCurrentMeasurement();

      expect(blankMeasurement.measurement.id).toBeDefined();
      expect(blankMeasurement.measurement.date).toBeDefined();
      expect(blankMeasurement.measurement.dryer).toBe(0);
      expect(blankMeasurement.measurement.status).toBe(MeasurementStatus.ONGOING);
      expect(blankMeasurement.measurement.towers.left).toBe(0);
      expect(blankMeasurement.measurement.towers.right).toBe(0);
      expect(blankMeasurement.nextTowerSwitchTime).toBe(0);
      expect(typeof blankMeasurement.measurement.id).toBe('number');
      expect(typeof blankMeasurement.measurement.date).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully for getDryers', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.getDryers();

      expect(result).toEqual([]);
    });

    it('should handle storage errors gracefully for getMeasurements', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.getMeasurements();

      expect(result).toEqual([]);
    });

    it('should handle malformed JSON data for getDryers', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await storage.getDryers();

      expect(result).toEqual([]);
    });

    it('should handle malformed JSON data for getMeasurements', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await storage.getMeasurements();

      expect(result).toEqual([]);
    });
  });
});