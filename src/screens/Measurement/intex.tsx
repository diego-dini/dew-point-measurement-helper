import Button from "elements/Button";
import CardDisplayPrimary from "elements/CardDisplayPrimary";
import LabeledDisplay from "elements/LabeledDisplay";
import LabeledInput from "elements/LabeledInput";
import Loading from "elements/Loading";
import { View, Text } from "react-native";
import { useLoading } from "contexts/LoadingContext";
import { useNotification } from "contexts/NotificationContext";
import { useEffect, useState } from "react";
import {
  UpdateNextMeasurementProvider,
  useUpdateNextMeasurement,
} from "contexts/UpdateNextMeasurementContext";

export default function Measurement() {
  return (
    <CardDisplayPrimary>
      <Text>Não implementado</Text>
    </CardDisplayPrimary>
  );
}
