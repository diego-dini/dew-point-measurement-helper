import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

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
