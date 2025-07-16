import { TouchableOpacity, StyleSheet, Text } from "react-native";

import { Dryer } from "types/dryer";
import storage from "utils/storage";

interface DryerButtonProps {
  dryer: Dryer;
  selectDryer: (dryer: Dryer) => void;
}

export default function DryerButton({ dryer, selectDryer }: DryerButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => selectDryer(dryer)}
      style={style.container}
    >
      <Text style={style.text}>{dryer.name}</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    width: "23.25%",
    height: 36,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#154B52",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#D0DBF9",
  },
});
