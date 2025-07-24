import CardDisplayPrimary from "elements/CardDisplayPrimary";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Measurement } from "types/measurement";
import storage from "utils/storage";
import MeasurementEntry from "./MeasurementEntry";

export default function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  useEffect(() => {
    storage.getMeasurements().then((response) => setMeasurements(response));
  }, []);
  return (
    <View style={{ flex: 1, borderRadius: 8 }}>
      <ScrollView style={{ borderRadius: 8 }}>
        <CardDisplayPrimary>
          {measurements.map((entry, idx) => (
            <MeasurementEntry measurement={entry} key={idx} />
          ))}
        </CardDisplayPrimary>
      </ScrollView>
    </View>
  );
}
