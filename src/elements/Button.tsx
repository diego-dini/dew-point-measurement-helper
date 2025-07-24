import { ReactNode } from "react";
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
} from "react-native";

/**
 * Props do componente Button.
 *
 * @property color - Cor do botão ("red" ou "green").
 * @property textProps - Props adicionais para o texto interno.
 * @property value - Valor alternativo para exibir no botão (caso children não seja passado).
 * @property children - Conteúdo do botão.
 * @property size - Tamanho do texto ("big", "medium" ou "small").
 * @property style - Estilo customizado para o botão.
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
 * Exibe um botão estilizado com suporte a diferentes tamanhos de fonte, cores e estilos customizados.
 *
 * @param color - Cor do botão ("red" ou "green").
 * @param textProps - Props adicionais para o texto.
 * @param value - Valor alternativo para exibir no botão.
 * @param size - Tamanho do texto.
 * @param children - Conteúdo do botão.
 * @param style - Estilo customizado para o botão.
 * @param restProps - Outras props do TouchableOpacity.
 */
export default function Button({
  color,
  textProps,
  value,
  size = "big",
  children,
  style: styleProp,
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

  // Renderiza o botão com estilos combinados
  return (
    <TouchableOpacity
      style={[
        style.container,
        colorStyle,
        disabledStyle,
        styleProp as ViewStyle,
      ]}
      {...restProps}
    >
      <Text
        allowFontScaling={true}
        style={[style.text, fontSizeMap[size]]}
        {...textProps}
      >
        {children || value}
      </Text>
    </TouchableOpacity>
  );
}

// Estilos do componente Button
const style = StyleSheet.create({
  /**
   * Estilo base do botão
   */
  container: {
    borderRadius: 4,
    padding: 8,
    minHeight: 32,
    overflow: "visible",
  },
  /**
   * Estilo base do texto do botão
   */
  text: {
    color: "#D0DBF9",
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
  },
  /**
   * Estilos de tamanho do texto
   */
  textBig: {
    fontSize: 24,
  },
  textMedium: {
    fontSize: 20,
  },
  textSmall: {
    fontSize: 16,
  },
  /**
   * Estilos de cor do botão
   */
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
