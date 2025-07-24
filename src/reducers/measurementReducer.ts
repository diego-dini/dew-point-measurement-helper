import { act } from "react";
import { measure } from "react-native-reanimated";
import {
  CurrentMeasurement,
  Measurement,
  MeasurementStatus,
} from "types/measurement";
import storage from "utils/storage";

export type MeasurementState = {
  measurement: Measurement;
  nextMeasurement: number;
};

export type MeasurementReducerAction =
  | { type: "NEW" }
  | { type: "SET-MEASUREMENT"; value: Measurement }
  | { type: "SET-NEXT-MEASUREMENT"; value: number }
  | { type: "UPDATE-ID"; value: number }
  | { type: "UPDATE-DATE"; value: number }
  | { type: "UPDATE-DRYER-ID"; value: number }
  | { type: "UPDATE-TOWERS"; value: { left: number; right: number } }
  | { type: "UPDATE-TOWER"; tower: "left" | "right"; value: number }
  | { type: "UPDATE-STATUS"; value: MeasurementStatus };

export default function MeasurementReducer(
  state: CurrentMeasurement,
  action: MeasurementReducerAction
) {
  switch (action.type) {
    case "NEW":
      return storage.getBlankCurrentMeasurement();
    case "SET-MEASUREMENT":
      return { ...state, measurement: action.value };

    case "SET-NEXT-MEASUREMENT":
      return { ...state, nextMeasurement: action.value };
    case "UPDATE-ID":
      return {
        ...state,
        measurement: { ...state.measurement, id: action.value },
      };
    case "UPDATE-DATE":
      return {
        ...state,
        measurement: { ...state.measurement, date: action.value },
      };
    case "UPDATE-DRYER-ID":
      return {
        ...state,
        measurement: { ...state.measurement, dryer: action.value },
      };
    case "UPDATE-TOWERS":
      return {
        ...state,
        measurement: { ...state.measurement, towers: action.value },
      };
    case "UPDATE-TOWER":
      return {
        ...state,
        measurement: {
          ...state.measurement,
          towers: { ...state.measurement.towers, [action.tower]: action.value },
        },
      };
    case "UPDATE-STATUS":
      return {
        ...state,
        measurement: { ...state.measurement, status: action.value },
      };
    default:
      return state;
  }
}
