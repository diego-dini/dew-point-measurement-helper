import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
  View,
} from "react-native";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

export default function DefaultButton(
  props: { children: ReactNode } & TouchableOpacityProps
) {
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={[style.button, props.disabled ? style.disable : style.enable]}
        {...props}
      >
        <Text style={style.buttonText}>{props.children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    margin: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  enable: { backgroundColor: "#1976d2" },
  disable: { backgroundColor: "#90caf9" },
});
