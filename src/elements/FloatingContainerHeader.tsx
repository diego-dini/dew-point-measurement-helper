import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";


/**
 * Componente de cabeçalho flutuante estilizado.
 *
 * Envolve o conteúdo em um header com fundo, sombra e centralização.
 *
 * @param children - Conteúdo do header.
 */
interface FloatingContainerHeaderProps {
  children: ReactNode;
}

export default function FloatingContainerHeader({ children }: FloatingContainerHeaderProps) {
  return (
    <View style={style.container}>
      <Text style={style.text}>{children}</Text>
    </View>
  );
}


// Estilos do componente FloatingContainerHeader
const style = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#154B52",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D0DBF9",
    textAlign: "center",
  },
});
