import { createContext, useContext, useReducer, ReactNode } from "react";
import dryerReducer, {
  DryerReducerAction,
  initialState,
} from "reducers/dryerReducer";
import {
  MeasurementReducerAction,
  MeasurementState,
} from "reducers/measurementReducer";
import { Dryer } from "types/dryer";

type MeasurementContextType = {
  state: MeasurementState;
  dispatch: React.Dispatch<MeasurementReducerAction>;
};

export const MeasurementContext = createContext<
  MeasurementContextType | undefined
>(undefined);

export function useMeasurement() {
  const context = useContext(MeasurementContext);
  if (!context) {
    throw new Error("useMeasurement must be used within a MeasurementProvider");
  }
  return context;
}
