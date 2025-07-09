import { View, Text, TouchableOpacity } from "react-native";
import DryerControllerScreen from "screens/DryerController";
import MeasurementControllerScreen from "screens/MeasurementController";
import MeasurementHistoryScreen from "screens/MeasurementHistory";

export default function Header({
  setBody,
}: {
  setBody: (body: React.ReactNode) => void;
}) {
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
