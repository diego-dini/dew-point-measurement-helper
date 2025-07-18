import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * Componente de container padrão da aplicação.
 * Fornece layout flex com padding e cor de fundo consistente.
 * @param props Props incluindo children (conteúdo do container) e todas as props de View
 */
export default function DefaultContainer(
  props: { children: ReactNode } & ViewProps
) {
  const { children, ...remainingProps } = props;
  return (
    <View style={style.container} {...remainingProps}>
      {children}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
    zIndex: 1,
  },
});
