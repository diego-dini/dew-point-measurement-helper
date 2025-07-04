/**
 * Representa uma medição realizada no sistema.
 * @property id Identificador único da medição.
 * @property date Data/hora da medição em milissegundos (timestamp).
 * @property dryer Identificador do desumidificador utilizado.
 * @property towers Valores das torres esquerda e direita.
 * @property status Status atual da medição.
 */
export type Measurement = {
  id: number;
  date: number; 
  dryer: number;
  towers: { left: number; right: number };
  status: MeasurementStatus;
};

/**
 * Enumeração dos possíveis status de uma medição.
 * - ONGOING: Medição em andamento
 * - COMPLETE: Medição finalizada
 * - CANCELED: Medição cancelada
 */
export enum MeasurementStatus {
  ONGOING = "ongoing",
  COMPLETE = "complete",
  CANCELED = "canceled",
}

/**
 * Representa o estado atual de uma medição em andamento e o tempo para a próxima troca de torre.
 * @property measurement Medição atual em andamento
 * @property nextTowerSwitchTime Data/hora (timestamp em milissegundos) em que ocorrerá a próxima troca de torre para permitir nova medição
 */
export type CurrentMeasurement = {
  measurement: Measurement;
  nextTowerSwitchTime: number;
};
