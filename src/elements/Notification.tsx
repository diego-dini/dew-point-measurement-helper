import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { useEffect, useRef } from "react";
import Overlay from "./Overlay";
import Button from "./Button";
import { useNotification } from "contexts/NotificationContext";
import FloatingContainerHeader from "./FloatingContainerHeader";

/**
 * Propriedades do componente Notification.
 *
 * @property visible - Define se a notificação está visível.
 * @property text - Texto da notificação.
 * @property onConfirm - Função chamada ao confirmar.
 * @property onCancel - Função chamada ao cancelar.
 */
export interface NotificationProps {
  visible: boolean;
  text?: string | undefined;
  onConfirm?: (event: GestureResponderEvent) => void;
  onCancel?: (event: GestureResponderEvent) => void;
}

/**
 * Componente de notificação com overlay.
 *
 * Exibe uma notificação com título, texto e botões de ação.
 *
 * @param visible - Define se a notificação está visível.
 * @param text - Texto da notificação.
 * @param onConfirm - Função chamada ao confirmar.
 * @param onCancel - Função chamada ao cancelar.
 */
export default function Notification({
  visible,
  text,
  onConfirm,
  onCancel,
}: NotificationProps) {
  const setNotification = useNotification().setNotification;
  if (!visible) return null;
  return (
    <Overlay>
      <View style={style.container}>
        <FloatingContainerHeader>Atenção</FloatingContainerHeader>
        <View style={style.subContainer}>
          <Text style={style.text}>{text || "Nada aqui"}</Text>
          <View style={style.buttonContainer}>
            {onCancel !== undefined ? (
              <Button size="medium" onPress={onCancel} style={{ flex: 1 }}>
                Cancelar
              </Button>
            ) : undefined}
            <Button
              color="green"
              size="medium"
              onPress={
                onConfirm || ((e) => setNotification({ visible: false }))
              }
            >
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    </Overlay>
  );
}

// Estilos do componente Notification
const style = StyleSheet.create({
  container: {
    backgroundColor: "#D0DBF9",
    borderRadius: 8,
    width: 256,
    height: 256,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  subContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "column",
    padding: 8,
    gap: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    columnGap: 4,
  },
  text: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    height: 156,
    width: 240,
  },
});
