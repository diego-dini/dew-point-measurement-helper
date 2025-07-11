// Todas as datas e horários utilizados neste storage são representados em timestamp (milissegundos desde 01/01/1970 UTC).

import { Dryer } from "../types/dryer";
import {
  CurrentMeasurement,
  Measurement,
  MeasurementStatus,
} from "../types/measurement";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRYERS_KEY = "dryers";
const MEASUREMENT_HISTORY_KEY = "measurement-history";
const CURRENT_MEASUREMENT_KEY = "current-measurement";

interface Operation {
  callback: CallableFunction;
  params: { key: string; data?: object };
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

class storage {
  operations: Operation[] = [];
  private processing = false;
  private static instance: storage;

  private constructor() {}

  /**
   * Retorna a instância única de storage (Singleton).
   */
  static getInstance() {
    if (!storage.instance) {
      storage.instance = new storage();
    }
    return storage.instance;
  }

  enqueueOperation(key: string, data?: object) {
    const params = { key, data };
    let callback = null;
    if (!data) {
      callback = loadData;
    } else {
      callback = saveData;
    }
    return new Promise<any>((resolve, reject) => {
      this.operations.push({ callback, params, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Processa a fila de operações de forma sequencial, sem setInterval.
   */
  private async processQueue() {
    if (this.processing) return;
    this.processing = true;
    while (this.operations.length > 0) {
      const currentOperation = this.operations.shift();
      if (currentOperation) {
        try {
          const result = await Promise.resolve(
            currentOperation.callback(currentOperation.params)
          );
          currentOperation.resolve(result);
        } catch (e) {
          currentOperation.reject(e);
        }
      }
    }
    this.processing = false;
  }

  /**
   * Adiciona um novo desumidificador ao armazenamento local.
   * @param newDryer Objeto Dryer a ser adicionado
   * @returns true se adicionado com sucesso, false se já existe um com o mesmo id
   */
  async addDryer(newDryer: Dryer): Promise<boolean> {
    const dryersList = (await this.enqueueOperation(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex((dryer) => dryer.id == newDryer.id);
    if (dryerIndex != -1) return false;
    dryersList.push(newDryer);
    return this.enqueueOperation(DRYERS_KEY, dryersList);
  }

  /**
   * Remove um desumidificador pelo id.
   * @param dryerId Id do desumidificador a ser removido
   * @returns true se removido com sucesso, false se não encontrado
   */
  async removeDryer(dryerId: number): Promise<boolean> {
    const dryersList = (await this.enqueueOperation(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex((dryer) => dryer.id == dryerId);
    if (dryerIndex < 0) return false;
    const newDryerList = dryersList.filter((dryer) => dryer.id != dryerId);
    return this.enqueueOperation(DRYERS_KEY, newDryerList);
  }

  /**
   * Atualiza um desumidificador existente.
   * @param updatedDryer Objeto Dryer atualizado
   * @returns true se atualizado com sucesso, false se não encontrado
   */
  async updateDryer(updatedDryer: Dryer): Promise<boolean> {
    const dryersList = (await this.enqueueOperation(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex(
      (dryer) => dryer.id == updatedDryer.id
    );
    if (dryerIndex < 0) return false;
    dryersList[dryerIndex] = updatedDryer;
    return this.enqueueOperation(DRYERS_KEY, dryersList);
  }
  /**
   * Busca desumidificadores cadastrados, podendo filtrar por id e/ou nome.
   * @param params Filtros opcionais: id e/ou name
   * @returns Lista de desumidificadores encontrados
   */
  async getDryers(params?: { id?: number; name?: string }): Promise<Dryer[]> {
    let dryers = (await this.enqueueOperation(DRYERS_KEY)).map(
      (dryer: Object) => {
        if ("cicles" in dryer) {
          const { cicles, ...rest } = dryer;
          return { ...rest, cycles: cicles };
        }
        return dryer;
      }
    ) as Dryer[];
    if (!params) return dryers;
    if (params.id) dryers = dryers.filter((entry) => entry.id === params.id);
    if (params.name)
      dryers = dryers.filter((entry) => entry.name === params.name);

    return dryers;
  }

  /**
   * Adiciona uma nova medição ao histórico.
   * @param newMeasurement Objeto Measurement a ser adicionado
   * @returns true se adicionado com sucesso, false se já existe uma medição com o mesmo id
   */
  async addMeasurement(newMeasurement: Measurement): Promise<boolean> {
    const measurements = (await this.enqueueOperation(
      MEASUREMENT_HISTORY_KEY
    )) as Measurement[];

    const measurementIndex = measurements.findIndex(
      (measurement) => measurement.id == newMeasurement.id
    );
    if (measurementIndex != -1) return false;
    measurements.push(newMeasurement);
    return this.enqueueOperation(MEASUREMENT_HISTORY_KEY, measurements);
  }

  /**
   * Busca medições do histórico, podendo filtrar por desumidificador, status e intervalo de datas.
   * @param params Filtros: dryer (id do desumidificador), status, startDate, endDate
   * @returns Lista de medições encontradas
   */
  async getMeasurements(params?: {
    dryer?: number;
    startDate?: number;
    endDate?: number;
    status?: MeasurementStatus;
  }): Promise<Measurement[]> {
    let measurements = (await this.enqueueOperation(
      MEASUREMENT_HISTORY_KEY
    )) as Measurement[];
    if (!params) return measurements;
    if (params.dryer)
      measurements = measurements.filter(
        (entry) => entry.dryer == params.dryer
      );
    if (params.status)
      measurements = measurements.filter(
        (entry) => entry.status == params.status
      );

    if (params.startDate) {
      measurements = measurements.filter(
        (entry) => entry.date > params.startDate!
      );
    }

    if (params.endDate)
      measurements = measurements.filter(
        (entry) => entry.date < params.endDate!
      );

    return measurements || [];
  }

  async saveCurrenMeasurement(
    newCurrentMeasurement: CurrentMeasurement
  ): Promise<boolean> {
    const newCurrentMeasurementString = JSON.stringify(newCurrentMeasurement);
    try {
      await AsyncStorage.setItem(
        CURRENT_MEASUREMENT_KEY,
        newCurrentMeasurementString
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async getCurrentMeasurement(): Promise<CurrentMeasurement> {
    const currentMeasurementString = await AsyncStorage.getItem(
      CURRENT_MEASUREMENT_KEY
    );
    if (!currentMeasurementString) return this.getBlankCurrentMeasurement();
    return JSON.parse(currentMeasurementString);
  }

  getBlankCurrentMeasurement(): CurrentMeasurement {
    const generateNumericId = () => {
      return Number(String(Date.now()) + String(Math.random()).substring(2, 8));
    };
    return {
      measurement: {
        id: generateNumericId(),
        date: Date.now(),
        dryer: 0,
        status: MeasurementStatus.ONGOING,
        towers: { left: 0, right: 0 },
      },
      nextTowerSwitchTime: 0,
    };
  }
}

async function loadData(params: { key: string }): Promise<[]> {
  try {
    const { key } = params;
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      return data || [];
    }
    return [];
  } catch (e) {
    return [];
  }
}

async function saveData(params: { key: string; data: Object }) {
  try {
    const { key, data } = params;
    const dataString = JSON.stringify(data);
    await AsyncStorage.setItem(key, dataString);
    return true;
  } catch (e) {
    return false;
  }
}

export default storage.getInstance();
