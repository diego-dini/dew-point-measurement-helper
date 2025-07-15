import Button from "elements/Button";
import CardDisplayPrimary from "elements/CardDisplayPrimary";
import LabeledDisplay from "elements/LabeledDisplay";
import LabeledInput from "elements/LabeledInput";
import Loading from "elements/Loading";
import { View, Text } from "react-native";
import { useLoading } from "Context/LoadingContext";
import { useNotification } from "Context/NotificationContext";
import { useEffect, useState } from "react";
import {
  UpdateNextMeasurementProvider,
  useUpdateNextMeasurement,
} from "Context/UpdateNextMeasurementContext";

export default function Measurement() {
  return (
    <CardDisplayPrimary>
      <Text>Não implementado</Text>
    </CardDisplayPrimary>
  );
}
