import { ReactNode } from "react";
import {
  View,
  ViewProps,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";

/**
 * Propriedades do componente Button.
 *
 * @property color - Define a cor do botão ("red" ou "green").
 * @property textProps - Props adicionais para o componente Text interno.
 * @property value - Valor a ser exibido no botão (caso children não seja passado).
 * @property children - Conteúdo do botão.
 * @property size - Tamanho da fonte do texto ("big", "medium" ou "small").
 * @property ...restProps - Props padrão do TouchableOpacity.
 */
interface ButtonProps extends TouchableOpacityProps {
  color?: "red" | "green";
  textProps?: TextProps;
  value?: ReactNode;
  children?: ReactNode;
  size?: "big" | "medium" | "small";
}

/**
 * Componente de botão customizado.
 *
 * Exibe um botão estilizado com suporte a diferentes tamanhos de fonte e cores.
 *
 * @param color - Cor do botão ("red" ou "green").
 * @param textProps - Props adicionais para o texto.
 * @param value - Valor a ser exibido se children não for passado.
 * @param size - Tamanho do texto ("big", "medium" ou "small").
 * @param children - Conteúdo do botão.
 * @param restProps - Outras props do TouchableOpacity.
 */
export default function Button({
  color,
  textProps,
  value,
  size = "big",
  children,
  ...restProps
}: ButtonProps) {
  // Mapeamento de estilos de texto por tamanho
  const fontSizeMap = {
    big: style.textBig,
    medium: style.textMedium,
    small: style.textSmall,
  };

  // Define o estilo de cor do botão
  const colorStyle = color !== "green" ? style.red : style.green;
  // Define o estilo de desabilitado, se aplicável
  const disabledStyle =
    restProps.disabled === true ? style.greenDisable : undefined;

  return (
    <TouchableOpacity
      style={{
        ...style.container,
        ...colorStyle,
        ...disabledStyle,
      }}
      {...restProps}
    >
      <Text
        allowFontScaling={true}
        style={{ ...style.text, ...fontSizeMap[size] }}
        {...textProps}
      >
        {children || value}
      </Text>
    </TouchableOpacity>
  );
}

// Estilos do componente Button
const style = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 4,
    padding: 8,
    minHeight: 32,
  },
  text: {
    color: "#D0DBF9",
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
  },
  textBig: {
    fontSize: 24,
  },
  textMedium: {
    fontSize: 20,
  },
  textSmall: {
    fontSize: 16,
  },
  red: {
    backgroundColor: "#A52502",
  },
  green: {
    backgroundColor: "#154B52",
  },
  greenDisable: {
    backgroundColor: "#2F7180",
  },
});
