import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * Container padrão para agrupar ações/botões.
 * Fornece layout flexível em coluna com espaçamento apropriado.
 * @param props Props incluindo children (ações/botões) e todas as props de View
 */
export default function DefaultActionContainer(
  props: { children: ReactNode } & ViewProps
) {
  const { children, ...remainingProps } = props;
  return (
    <View style={style.actionContainer} {...remainingProps}>
      {children}
    </View>
  );
}

const style = StyleSheet.create({
  actionContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
