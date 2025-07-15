import { ReactNode } from "react";
import { View, ViewProps, StyleSheet, Dimensions } from "react-native";

/**
 * Propriedades do componente CardDisplayTertiary.
 *
 * @property children - Conteúdo a ser exibido dentro do card.
 * @property ...restProps - Outras props do View.
 */
interface CardDisplayTertiaryProps extends ViewProps {
  children: ReactNode;
}

/**
 * Componente de card terciário estilizado.
 *
 * Envolve o conteúdo em um card com fundo, borda arredondada e padding.
 *
 * @param children - Conteúdo do card.
 * @param restProps - Outras props do View.
 */
export default function CardDisplayTertiary({
  children,
  ...restProps
}: CardDisplayTertiaryProps) {
  return (
    <View style={style.container} {...restProps}>
      {children}
    </View>
  );
}

// Estilos do componente CardDisplayTertiary
const style = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#4999AD",
    width: "100%",
  },
});
