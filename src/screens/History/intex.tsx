import CardDisplayPrimary from "elements/CardDisplayPrimary";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Measurement } from "types/measurement";
import storage from "utils/storage";
import MeasurementEntry from "./MeasurementEntry";

export default function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  useEffect(() => {
    storage.getMeasurements().then((response) => setMeasurements(response));
  }, []);
  return (
    <View>
      <CardDisplayPrimary>
        {measurements.map((entry) => (
          <MeasurementEntry measurement={entry} />
        ))}
      </CardDisplayPrimary>
    </View>
  );
}
