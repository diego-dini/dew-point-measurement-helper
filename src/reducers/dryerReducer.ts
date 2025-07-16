import { Dryer, DryerCycle } from "types/dryer";

type DryerState = Dryer;

export type DryerReducerAction =
  | { type: "SET_DRYER"; value: Dryer }
  | { type: "CLEAR_DRYER" }
  | { type: "SET_ID"; value: number }
  | { type: "SET_NAME"; value: string }
  | { type: "ADD_CYCLE"; value: DryerCycle }
  | { type: "REMOVE_CYCLE"; value: number }
  | { type: "UPDATE_CYCLE"; value: { index: number; data: DryerCycle } }
  | { type: "UPDATE_CYCLES"; value: DryerCycle[] };

export const initialState = { id: 0, name: "", cycles: [] };

export default function dryerReducer(
  state: DryerState,
  action: DryerReducerAction
): DryerState {
  switch (action.type) {
    case "SET_DRYER":
      return action.value;
    case "CLEAR_DRYER":
      return initialState;
    case "SET_ID":
      return { ...state, id: action.value };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "ADD_CYCLE":
      return { ...state, cycles: [...state.cycles, action.value] };
    case "REMOVE_CYCLE":
      return {
        ...state,
        cycles: state.cycles.filter((_, idx) => idx !== action.value),
      };
    case "UPDATE_CYCLE":
      return {
        ...state,
        cycles: state.cycles.map((dryer, idx) =>
          idx === action.value.index ? action.value.data : dryer
        ),
      };
    case "UPDATE_CYCLES":
      return { ...state, cycles: action.value };
    default:
      return { ...state };
  }
}
