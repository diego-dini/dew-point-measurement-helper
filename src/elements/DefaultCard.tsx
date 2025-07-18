import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * Componente de cartão padrão com estilo material design.
 * Fornece um container com fundo branco, bordas arredondadas e sombra.
 * @param props Props incluindo children (conteúdo do cartão) e todas as props de View
 */
export default function DefaultCardContainer(
  props: { children: ReactNode } & ViewProps
) {
  const { children, style: pstyle, ...remainingProps } = props;
  return (
    <View style={[style.card, pstyle]} {...remainingProps}>
      {children}
    </View>
  );
}

const style = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
