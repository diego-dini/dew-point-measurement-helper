/**
 * Representa um desumidificador cadastrado no sistema.
 * @property id Identificador único do desumidificador.
 * @property name Nome do desumidificador.
 * @property cycles Lista de ciclos de operação do desumidificador.
 */
export type Dryer = {
  id: number;
  name: string;
  cycles: DryerCycle[];
};

/**
 * Representa um ciclo de operação de um desumidificador.
 * @property name Nome do ciclo.
 * @property duration Duração do ciclo em milissegundos.
 */
export type DryerCycle = {
  name: string;
  duration: number;
};
