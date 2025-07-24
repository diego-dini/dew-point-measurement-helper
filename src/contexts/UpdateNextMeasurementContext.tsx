import React, { createContext, useContext, useState, ReactNode } from "react";
import UpdateNextMeasurement, {
  UpdateNextMeasurementProps,
} from "elements/UpdateNextMeasurement";
import { GestureResponderEvent } from "react-native";

/**
 * Tipo da função para atualizar o estado do modal de próxima medição.
 * Recebe um objeto UpdateNextMeasurementProps.
 */
type setUpdateNextMeasurementType = ({}: UpdateNextMeasurementProps) => void;

/**
 * Interface do contexto de próxima medição global.
 *
 * @property setUpdateNextMeasurement - Função para exibir/ocultar o modal de próxima medição.
 */
interface UpdateNextMeasurementContextType {
  setUpdateNextMeasurement: setUpdateNextMeasurementType;
}

/**
 * Contexto React para gerenciamento global do estado do modal de próxima medição.
 */
const UpdateNextMeasurementContext =
  createContext<UpdateNextMeasurementContextType>({
    setUpdateNextMeasurement: () => {},
  });

/**
 * Hook personalizado para acessar o contexto de próxima medição.
 * @returns Objeto com função setUpdateNextMeasurement para controlar o modal global
 */
export function useUpdateNextMeasurement() {
  return useContext(UpdateNextMeasurementContext);
}

/**
 * Provider do contexto de próxima medição que envolve a aplicação.
 * Fornece estado global para exibir/ocultar o modal de próxima medição.
 * @param children Componentes filhos que terão acesso ao contexto
 */
export function UpdateNextMeasurementProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Estado local para controlar visibilidade e handler de confirmação do modal
  const [visible, setVisible] = useState(false);

  /**
   * Controla a exibição do modal de próxima medição global.
   * @param visible Visibilidade do modal (true/false)
   */
  const setUpdateNextMeasurement: setUpdateNextMeasurementType = ({
    visible: v,
  }) => {
    console.log("BBBBBBBB");
    setVisible(v);
  };

  return (
    <UpdateNextMeasurementContext.Provider value={{ setUpdateNextMeasurement }}>
      {children}
      <UpdateNextMeasurement visible={visible} />
    </UpdateNextMeasurementContext.Provider>
  );
}
