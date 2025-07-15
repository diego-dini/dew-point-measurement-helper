import React, { Children, ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
  StyleSheet,
  Touchable,
  Dimensions,
} from "react-native";
import Dryers from "screens/Dryers";
import History from "screens/History/intex";
import Measurement from "screens/Measurement/intex";

/**
 * Propriedades do componente Header.
 *
 * @property setBody - Função para definir o conteúdo principal da tela.
 * @property ...restProps - Outras props do View.
 */
interface HeaderProps extends ViewProps {
  setBody: (body: ReactNode) => void;
}

/**
 * Enumeração dos corpos possíveis para navegação.
 */
enum Bodys {
  DRYERS = "dryers",
  HISTORY = "history",
  MEASUREMENT = "measurement",
}

/**
 * Componente de cabeçalho de navegação.
 *
 * Exibe botões para alternar entre as telas principais do app.
 *
 * @param setBody - Função para definir o conteúdo principal.
 */
export default function Header({ setBody }: HeaderProps) {
  const [selected, setSelected] = useState<Bodys>(Bodys.MEASUREMENT);

  // Atualiza o conteúdo principal conforme o item selecionado
  useEffect(() => {
    switch (selected) {
      case Bodys.DRYERS:
        setBody(<Dryers />);
        break;
      case Bodys.MEASUREMENT:
        setBody(<Measurement />);
        break;
      case Bodys.HISTORY:
        setBody(<History />);
        break;
    }
  }, [selected, setBody]);

  /**
   * Botão de navegação do header.
   * @param children - Texto do botão.
   * @param body - Valor do enum Bodys correspondente.
   */
  const Button = ({ children, body }: { children: ReactNode; body: Bodys }) => (
    <TouchableOpacity style={style.button} onPress={() => setSelected(body)}>
      <Text
        style={{
          ...style.font,
          ...(selected === body ? style.selected : {}),
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={style.container}>
      <Button body={Bodys.MEASUREMENT}>Medição</Button>
      <Button body={Bodys.DRYERS}>Desumidificador</Button>
      <Button body={Bodys.HISTORY}>Histórico</Button>
    </View>
  );
}

// Estilos do componente Header
const style = StyleSheet.create({
  container: {
    backgroundColor: "#1C8394",
    width: Dimensions.get("window").width - 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignSelf: "center",
    rowGap: 20,
    margin: 4,
  },
  button: {
    alignSelf: "flex-start",
  },
  font: {
    fontFamily: "Roboto",
    fontSize: 18,
  },
  selected: {
    color: "#D0DBF9",
  },
});
