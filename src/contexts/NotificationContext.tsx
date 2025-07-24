import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification, { NotificationProps } from "elements/Notification";
import { GestureResponderEvent } from "react-native";

/**
 * Tipo da função para atualizar o estado da notificação.
 * Recebe um objeto NotificationProps.
 */
type setNotificationType = ({}: NotificationProps) => void;

/**
 * Interface do contexto de notificação global.
 *
 * @property setNotification - Função para exibir/ocultar a notificação.
 */
interface NotificationContextType {
  setNotification: setNotificationType;
}

/**
 * Contexto React para gerenciamento global do estado de notificação.
 */
const NotificationContext = createContext<NotificationContextType>({
  setNotification: () => {},
});

/**
 * Hook personalizado para acessar o contexto de notificação.
 * @returns Objeto com função setNotification para controlar o estado global de notificação
 */
export function useNotification() {
  return useContext(NotificationContext);
}

/**
 * Provider do contexto de notificação que envolve a aplicação.
 * Fornece estado global de notificação com overlay visual.
 * @param children Componentes filhos que terão acesso ao contexto
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  // Estado local para controlar visibilidade, texto e handlers da notificação
  const [lvisible, setVisible] = useState(false);
  const [ltext, setText] = useState<string | undefined>(undefined);
  const [lonConfirm, setOnConfirm] =
    useState<(event: GestureResponderEvent) => void>();
  const [lonCancel, setOnCancel] =
    useState<(event: GestureResponderEvent) => void>();

  /**
   * Controla a exibição da notificação global.
   * @param visible Visibilidade da notificação (true/false)
   * @param text Texto opcional a ser exibido
   * @param onConfirm Função chamada ao confirmar
   * @param onCancel Função chamada ao cancelar
   */
  const setNotification: setNotificationType = ({
    visible: v,
    text: t,
    onConfirm: onCon,
    onCancel: onCan,
  }) => {
    setVisible(v);
    setText(t);
    setOnConfirm(() => onCon);
    setOnCancel(() => onCan);
  };

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}
      <Notification
        visible={lvisible}
        text={ltext}
        onConfirm={lonConfirm}
        onCancel={lonCancel}
      />
    </NotificationContext.Provider>
  );
}
