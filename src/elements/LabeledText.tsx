import { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

/**
 * Props para o componente LabeledText.
 */
type LabeledTextProps = {
  children?: ReactNode;
  value?: ReactNode;
  labelValue: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Componente que exibe um texto com rótulo.
 * Útil para mostrar informações com formato "Label: Valor".
 * @param labelValue Texto do rótulo a ser exibido
 * @param value Valor a ser exibido (alternativamente pode usar children)
 */
export default function LabeledText(props: LabeledTextProps & TextProps) {
  const {
    children,
    value,
    labelValue,
    labelStyle,
    containerStyle,
    style,
    ...inputProps
  } = props;
  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{labelValue}: </Text>
      <Text style={[styles.value, style]} {...inputProps}>
        {value || children || undefined}
      </Text>
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
  value: {
    backgroundColor: "#f7fafd",
    color: "#222",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
    paddingLeft: 8,
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },
});
