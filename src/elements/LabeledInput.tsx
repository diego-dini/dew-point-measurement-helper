import { ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

/**
 * Propriedades do componente LabeledInput.
 *
 * @property labelValue - Label a ser exibido.
 * @property value - Valor do input (caso children não seja passado).
 * @property children - Conteúdo customizado para o input.
 * @property size - Tamanho do input ("big", "medium" ou "small").
 * @property ...restProps - Outras props do TextInput.
 */
interface LabeledInputProps extends TextInputProps {
  labelValue?: ReactNode;
  value?: string;
  children?: ReactNode;
  containerStyle?: ViewStyle;
  size?: "big" | "medium" | "small";
}

/**
 * Componente de input rotulado.
 *
 * Exibe um label e um campo de input com estilos variados por tamanho.
 *
 * @param labelValue - Label a ser exibido.
 * @param value - Valor do input.
 * @param children - Conteúdo customizado.
 * @param size - Tamanho do input.
 * @param restProps - Outras props do TextInput.
 */
export default function LabeledInput({
  labelValue,
  value,
  children,
  size = "big",
  containerStyle,
  ...restProps
}: LabeledInputProps) {
  // Mapeamento de estilos por tamanho
  const labelSizeMap = {
    big: style.labelBig,
    medium: style.labelMedium,
    small: style.labelSmall,
  };
  const inputSizeMap = {
    big: style.inputBig,
    medium: style.inputMedium,
    small: style.inputSmall,
  };
  const inputFontMap = {
    big: style.inputFontBig,
    medium: style.inputFontMedium,
    small: style.inputFontSmall,
  };

  return (
    <View style={{ ...style.container, ...containerStyle }}>
      {labelValue ? (
        <Text style={[style.label, labelSizeMap[size]]}>{labelValue}</Text>
      ) : undefined}
      <View style={[style.inputContainer, inputSizeMap[size]]}>
        <TextInput
          style={[style.inputText, inputFontMap[size]]}
          underlineColorAndroid="transparent"
          {...restProps}
        >
          {children || value || undefined}
        </TextInput>
      </View>
    </View>
  );
}

// Estilos do componente LabeledInput
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

  inputContainer: {
    height: 32,
    backgroundColor: "#D0DBF9",
    borderRadius: 8,
    overflow: "visible",
  },
  inputBig: { height: 32 },
  inputMedium: { height: 24 },
  inputSmall: { height: 20 },
  inputText: {
    height: 41,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000B0D",
    overflow: "visible",
  },
  inputFontBig: { top: -4, fontSize: 20 },
  inputFontMedium: { top: -8, height: 41, fontSize: 16 },
  inputFontSmall: { top: -10, fontSize: 14 },
});
