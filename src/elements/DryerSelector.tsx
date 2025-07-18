import {
  TouchableOpacity,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Keyboard,
} from "react-native";
import LabeledInput from "./LabeledInput";
import { useContext, useEffect, useState } from "react";
import { Dryer } from "types/dryer";
import storage from "utils/storage";
import DryerButton from "./DryerButton";
import { useDryer } from "contexts/DryerContext";

interface DryerSelectorProps {
  dryers?: Dryer[];
  edited?: boolean;
}

export default function DryerSelector({
  dryers: pDryer = [],
  edited = false,
}: DryerSelectorProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [dryers, setDryers] = useState<Dryer[]>(pDryer);
  const dryerContext = useDryer();

  useState(() => {
    if (dryers.length === 0) {
      storage.getDryers().then((response) => setDryers(response));
    }
  });

  const selectDryer = (dryer: Dryer) => {
    Keyboard.dismiss();
    setOpen(false);
    dryerContext.dispatch({ type: "SET_DRYER", value: dryer });
  };

  const onNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (e.nativeEvent.text == dryerContext.state.name) return;
    dryerContext.dispatch({ type: "SET_NAME", value: e.nativeEvent.text });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={(e) => {
          setOpen((prev) => !prev);
        }}
      >
        <LabeledInput
          labelValue="Desumidificador"
          onFocus={(e) => {
            setOpen(true);
          }}
          onBlur={(e) => setOpen(false)}
          value={dryerContext.state?.name || ""}
          onChange={onNameChange}
        ></LabeledInput>
      </TouchableOpacity>
      {open && !edited ? (
        <View style={style.container}>
          {dryers.map((dryer, idx) => (
            <DryerButton dryer={dryer} selectDryer={selectDryer} key={idx} />
          ))}
        </View>
      ) : undefined}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#D0DBF9",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#D0DBF9",
  },
});
