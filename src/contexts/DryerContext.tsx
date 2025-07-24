import { createContext, useContext, useReducer, ReactNode } from "react";
import dryerReducer, {
  DryerReducerAction,
  initialState,
} from "reducers/dryerReducer";
import { Dryer } from "types/dryer";

type DryerContextType = {
  state: Dryer;
  dispatch: React.Dispatch<DryerReducerAction>;
};

export const DryerContext = createContext<DryerContextType | undefined>(
  undefined
);
export function useDryer() {
  const context = useContext(DryerContext);
  if (!context) {
    throw new Error("useDryer must be used within a DryerProvider");
  }
  return context;
}
