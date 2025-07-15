import { ReactNode } from "react";
import { View, ViewProps, StyleSheet, Dimensions } from "react-native";


/**
 * Propriedades do componente CardDisplayPrimary.
 *
 * @property children - Conteúdo a ser exibido dentro do card.
 * @property ...restProps - Outras props do View.
 */
interface CardDisplayPrimaryProps extends ViewProps {
  children: ReactNode;
}


/**
 * Componente de card primário estilizado.
 *
 * Envolve o conteúdo em um card com fundo, borda arredondada e padding.
 *
 * @param children - Conteúdo do card.
 * @param restProps - Outras props do View.
 */
export default function CardDisplayPrimary({
  children,
  ...restProps
}: CardDisplayPrimaryProps) {
  return (
    <View style={style.container} {...restProps}>
      {children}
    </View>
  );
}


// Estilos do componente CardDisplayPrimary
const style = StyleSheet.create({
  container: {
    backgroundColor: "#4999AD",
    borderRadius: 12,
    padding: 8,
    flex: 0,
  },
});
