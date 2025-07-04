import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { Dryer } from "types/dryer";

/**
 * Botão estilizado para seleção de desumidificador.
 * Recebe o dryer e uma função para setar o dryer selecionado.
 * O texto do botão é passado via children.
 */
interface DryerButtonProps extends TouchableOpacityProps {
  setDryer: (dryer: Dryer) => void;
  dryer: Dryer;
  children: ReactNode;
}

export default function DryerButton({
  setDryer,
  dryer,
  children,
  style,
  ...props
}: DryerButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => setDryer(dryer)}
      style={[styles.button, style]}
      {...props}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1976d2",
    alignItems: "center",
    minWidth: 90,
    elevation: 2,
  },
  buttonText: {
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: 15,
  },
});
