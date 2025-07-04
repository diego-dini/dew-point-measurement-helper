// Todas as datas e horários utilizados neste storage são representados em timestamp (milissegundos desde 01/01/1970 UTC).

import { Dryer } from "../types/dryer";
import { Measurement, MeasurementStatus } from "../types/measurement";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRYERS_KEY = "dryers";
const MEASUREMENT_HISTORY_KEY = "measurement-history";

const storage = {
  /**
   * Adiciona um novo desumidificador ao armazenamento local.
   * @param newDryer Objeto Dryer a ser adicionado
   * @returns true se adicionado com sucesso, false se já existe um com o mesmo id
   */
  async addDryer(newDryer: Dryer): Promise<boolean> {
    const dryersList = (await loadData(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex((dryer) => dryer.id == newDryer.id);
    if (dryerIndex != -1) return false;
    dryersList.push(newDryer);
    return saveData(DRYERS_KEY, dryersList);
  },

  /**
   * Remove um desumidificador pelo id.
   * @param dryerId Id do desumidificador a ser removido
   * @returns true se removido com sucesso, false se não encontrado
   */
  async removeDryer(dryerId: number): Promise<boolean> {
    const dryersList = (await loadData(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex((dryer) => dryer.id == dryerId);
    if (dryerIndex < 0) return false;
    const newDryerList = dryersList.filter((dryer) => dryer.id != dryerId);
    return saveData(DRYERS_KEY, newDryerList);
  },

  /**
   * Atualiza um desumidificador existente.
   * @param updatedDryer Objeto Dryer atualizado
   * @returns true se atualizado com sucesso, false se não encontrado
   */
  async updateDryer(updatedDryer: Dryer): Promise<boolean> {
    const dryersList = (await loadData(DRYERS_KEY)) as Dryer[];
    const dryerIndex = dryersList.findIndex(
      (dryer) => dryer.id == updatedDryer.id
    );
    if (dryerIndex < 0) return false;
    dryersList[dryerIndex] = updatedDryer;
    return saveData(DRYERS_KEY, dryersList);
  },
  /**
   * Busca desumidificadores cadastrados, podendo filtrar por id e/ou nome.
   * @param params Filtros opcionais: id e/ou name
   * @returns Lista de desumidificadores encontrados
   */
  async getDryers(params?: { id?: number; name?: string }): Promise<Dryer[]> {
    let dryers = (await loadData(DRYERS_KEY)) as Dryer[];
    if (!params) return dryers;
    if (params.id) dryers = dryers.filter((entry) => entry.id === params.id);
    if (params.name)
      dryers = dryers.filter((entry) => entry.name === params.name);

    return dryers;
  },

  /**
   * Adiciona uma nova medição ao histórico.
   * @param newMeasurement Objeto Measurement a ser adicionado
   * @returns true se adicionado com sucesso, false se já existe uma medição com o mesmo id
   */
  async addMeasurement(newMeasurement: Measurement): Promise<boolean> {
    const measurements = (await loadData(
      MEASUREMENT_HISTORY_KEY
    )) as Measurement[];
    const measurementIndex = measurements.findIndex(
      (measurement) => measurement.id == newMeasurement.id
    );
    if (measurementIndex != -1) return false;
    measurements.push(newMeasurement);
    return saveData(MEASUREMENT_HISTORY_KEY, measurements);
  },

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
    let measurements = (await loadData(
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

    return measurements;
  },
};

async function loadData(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      return data || [];
    }
  } catch (e) {
    return [];
  }
}

async function saveData(key: string, data: Object) {
  try {
    const dataString = JSON.stringify(data);
    await AsyncStorage.setItem(key, dataString);
    return true;
  } catch (e) {
    return false;
  }
}

export default storage;
