import { ReactNode } from "react";
import { View, ViewProps, StyleSheet, Dimensions } from "react-native";

/**
 * Propriedades do componente CardDisplaySecondary.
 *
 * @property children - Conteúdo a ser exibido dentro do card.
 * @property ...restProps - Outras props do View.
 */
interface CardDisplaySecondaryProps extends ViewProps {
  children: ReactNode;
}

/**
 * Componente de card secundário estilizado.
 *
 * Envolve o conteúdo em um card com fundo, borda arredondada e padding.
 *
 * @param children - Conteúdo do card.
 * @param restProps - Outras props do View.
 */
export default function CardDisplaySecondary({
  children,
  ...restProps
}: CardDisplaySecondaryProps) {
  return (
    <View style={style.container} {...restProps}>
      {children}
    </View>
  );
}

// Estilos do componente CardDisplaySecondary
const style = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#1C8394",
    borderRadius: 8,
    width: "100%",
  },
});
