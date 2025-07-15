import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef } from "react";
import Overlay from "./Overlay";

/**
 * Propriedades do componente Loading.
 *
 * @property visible - Define se o loading está visível.
 * @property text - Texto a ser exibido junto ao indicador.
 */
interface LoadingProps {
  visible: boolean;
  text: string | undefined;
}

/**
 * Componente de loading com overlay.
 *
 * Exibe um indicador de carregamento e um texto opcional.
 *
 * @param visible - Define se o loading está visível.
 * @param text - Texto a ser exibido.
 */
export default function Loading({ visible, text }: LoadingProps) {
  if (!visible) return null;
  return (
    <Overlay>
      <View style={style.container}>
        <ActivityIndicator size="large" color="#000B0D" />
        <Text style={style.text}>{text}</Text>
      </View>
    </Overlay>
  );
}

// Estilos do componente Loading
const style = StyleSheet.create({
  container: {
    backgroundColor: "#D0DBF9",
    borderRadius: 8,
    width: 128,
    height: 128,
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
});
