import CardDisplayPrimary from "elements/CardDisplayPrimary";
import CardDisplaySecondary from "elements/CardDisplaySecondary";
import CardDisplayTertiary from "elements/CardDisplayTertiary";
import LabeledDisplay from "elements/LabeledDisplay";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Measurement } from "types/measurement";
import storage from "utils/storage";
import { timestampToDDMMYYYY } from "utils/time";

type MeasurementEntryType = {
  measurement: Measurement;
};

export default function MeasurementEntry({
  measurement,
}: MeasurementEntryType) {
  const [open, setOpen] = useState<boolean>(false);
  const [dryerName, setDryerName] = useState<String>("");

  useEffect(() => {
    storage.getDryers({ id: measurement.dryer }).then((response) => {
      setDryerName(response[0].name);
    });
  });
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.line}
        onPress={(e) => setOpen((prev) => !prev)}
      >
        <LabeledDisplay containerStyle={style.display}>
          {timestampToDDMMYYYY(measurement.date)}
        </LabeledDisplay>
        <LabeledDisplay containerStyle={style.display}>
          {dryerName}
        </LabeledDisplay>
      </TouchableOpacity>

      {open ? (
        <CardDisplaySecondary>
          <Text style={style.label}>Torres</Text>
          <CardDisplayTertiary
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <LabeledDisplay
              labelValue="Esquerda"
              containerStyle={{ width: "45%" }}
            >
              {measurement.towers.left}
            </LabeledDisplay>
            <LabeledDisplay
              labelValue="Direita"
              containerStyle={{ width: "45%" }}
            >
              {measurement.towers.right}
            </LabeledDisplay>
          </CardDisplayTertiary>
          <LabeledDisplay labelValue="Status">
            {measurement.status}
          </LabeledDisplay>
        </CardDisplaySecondary>
      ) : undefined}
    </View>
  );
}

// Estilos do componente Loading
const style = StyleSheet.create({
  container: {},
  line: { flexDirection: "row", gap: 4 },
  label: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
    fontSize: 24,
  },
  display: {
    flex: 1,
  },
});
