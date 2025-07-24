import { ReactNode } from "react";
import {
  View,
  Text,
  TextProps,
  ViewProps,
  StyleSheet,
  ViewStyle,
} from "react-native";

/**
 * Propriedades do componente LabeledDisplay.
 *
 * @property labelValue - Label a ser exibido.
 * @property value - Valor a ser exibido (caso children não seja passado).
 * @property children - Conteúdo customizado para o display.
 * @property size - Tamanho do display ("big", "medium" ou "small").
 */
interface LabeledDisplayProps {
  labelValue?: ReactNode;
  value?: string;
  children?: ReactNode;
  containerStyle?: ViewStyle;
  size?: "big" | "medium" | "small";
}

/**
 * Componente de exibição rotulada.
 *
 * Exibe um label e um valor (ou children) com estilos variados por tamanho.
 *
 * @param labelValue - Label a ser exibido.
 * @param value - Valor a ser exibido.
 * @param children - Conteúdo customizado.
 * @param size - Tamanho do display.
 */
export default function LabeledDisplay({
  labelValue,
  value,
  children,
  containerStyle,
  size = "big",
}: LabeledDisplayProps) {
  // Mapeamento de estilos por tamanho
  const labelSizeMap = {
    big: style.labelBig,
    medium: style.labelMedium,
    small: style.labelSmall,
  };
  const displaySizeMap = {
    big: style.displayBig,
    medium: style.displayMedium,
    small: style.displaySmall,
  };

  return (
    <View style={{ ...style.container, ...containerStyle }}>
      {labelValue ? (
        <Text style={[style.label, labelSizeMap[size]]}>{labelValue}</Text>
      ) : undefined}
      <Text style={[style.display, displaySizeMap[size]]}>
        {children || <Text>{value}</Text> || undefined}
      </Text>
    </View>
  );
}

// Estilos do componente LabeledDisplay
const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: 6,
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
  },
  labelBig: { fontSize: 24 },
  labelMedium: { fontSize: 20 },
  labelSmall: { fontSize: 16 },
  display: {
    backgroundColor: "#154B52",
    borderRadius: 8,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#D0DBF9",
  },
  displayBig: { fontSize: 20, height: 32 },
  displayMedium: { fontSize: 16, height: 24 },
  displaySmall: { fontSize: 12, height: 20 },
});
