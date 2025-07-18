import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

/**
 * Props para o componente LabeledTextInput.
 */
type LabeledTextInputProps = {
  labelValue: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Componente que exibe um campo de entrada de texto com rótulo.
 * Combina um Text como label com um TextInput para entrada de dados.
 * @param labelValue Texto do rótulo a ser exibido antes do input
 */
export default function LabeledTextInput(
  props: LabeledTextInputProps & TextInputProps
) {
  const { labelValue, labelStyle, containerStyle, style, ...inputProps } =
    props;

  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{labelValue}:</Text>
      <TextInput style={[styles.input, style]} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginHorizontal: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f0f0f0",
    color: "#222",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
    paddingLeft: 8,
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },
});
