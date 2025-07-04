/**
 * Representa um desumidificador cadastrado no sistema.
 * @property id Identificador único do desumidificador.
 * @property name Nome do desumidificador.
 * @property cicles Lista de ciclos de operação do desumidificador.
 */
export type Dryer = {
  id: number;
  name: string;
  cicles: DryerCicle[];
};

/**
 * Representa um ciclo de operação de um desumidificador.
 * @property name Nome do ciclo.
 * @property duration Duração do ciclo em milissegundos (string).
 */
export type DryerCicle = {
  name: string;
  duration: number;
};
