import { View, Text, StyleSheet, Dimensions } from "react-native";
import FloatingContainerHeader from "./FloatingContainerHeader";
import { ReactNode } from "react";

/**
 * Componente de overlay para exibir conteúdo sobreposto à tela.
 *
 * Centraliza o conteúdo e aplica um fundo escurecido.
 *
 * @param children - Conteúdo a ser exibido sobreposto.
 */
export default function Overlay({ children }: { children: ReactNode }) {
  return <View style={style.overlay}>{children}</View>;
}

// Estilos do componente Overlay
const style = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000052",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
