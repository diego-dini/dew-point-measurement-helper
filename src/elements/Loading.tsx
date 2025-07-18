import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

/**
 * Props para o componente Loading.
 */
type LoadingProps = {
  visible: boolean;
  text?: string;
};

/**
 * Componente de loading que exibe um overlay com spinner de carregamento.
 * Pode incluir texto opcional e cobre toda a tela quando visível.
 * @param visible Controla se o loading está visível
 * @param text Texto opcional a ser exibido abaixo do spinner
 */
export default function Loading({ visible, text }: LoadingProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#fff" />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  box: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
});
