import { View, Text, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import DryerControllerScreen from "screens/DryerController";
import MeasurementControllerScreen from "screens/MeasurementController";
import MeasurementHistoryScreen from "screens/MeasurementHistory";

/**
 * Props para o componente Header.
 */
interface HeaderProps {
  setBody: (body: ReactNode) => void;
}

/**
 * Componente de cabeçalho/navegação principal da aplicação.
 * Fornece botões para navegar entre as três telas principais:
 * - Medições
 * - Histórico de Medições  
 * - Desumidificadores
 * @param setBody Função para atualizar o conteúdo da tela principal
 */
export default function Header({ setBody }: HeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setBody(<MeasurementControllerScreen />)}
      >
        <Text>Medições</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setBody(<MeasurementHistoryScreen />)}>
        <Text>Historico de Medições</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setBody(<DryerControllerScreen />)}>
        <Text>Desumidificadores</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    alignItems: "center" as const,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
};
