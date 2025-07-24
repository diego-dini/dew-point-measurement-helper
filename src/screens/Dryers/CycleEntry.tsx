import { useDryer } from "contexts/DryerContext";
import Button from "elements/Button";
import LabeledInput from "elements/LabeledInput";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Keyboard,
} from "react-native";
import { DryerCycle } from "types/dryer";

/**
 * Componente para exibir e editar um ciclo individual de secador.
 * @param idx Índice do ciclo na lista.
 * @param cycle Objeto do ciclo do secador.
 */
interface CycleEntryProps {
  idx: number;
  cycle: DryerCycle;
}
export default function CycleEntry({ idx, cycle }: CycleEntryProps) {
  const [selected, setSelected] = useState(false);
  const [name, setName] = useState(cycle.name);
  const [duration, setDuration] = useState(cycle.duration);
  const dryerContext = useDryer();

  useEffect(() => {
    setName(cycle.name);
    setDuration(cycle.duration);
  }, [cycle]);

  /**
   * Handler para mudança do nome do ciclo.
   */
  const onNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    dryerContext.dispatch({
      type: "UPDATE_CYCLE",
      value: { index: idx, data: { name: e.nativeEvent.text, duration } },
    });
  };

  /**
   * Handler para mudança da duração do ciclo.
   */
  const onDurationChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (Number.isNaN(e.nativeEvent.text)) return;
    const num = Number(e.nativeEvent.text);
    dryerContext.dispatch({
      type: "UPDATE_CYCLE",
      value: { index: idx, data: { name, duration: num } },
    });
  };
  /**
   * Handler para remover o ciclo.
   */
  const onDeleteHandler = () => {
    Keyboard.dismiss();
    dryerContext.dispatch({ type: "REMOVE_CYCLE", value: idx });
  };
  /**
   * Handler para foco do input.
   */
  const onFocusHandler = () => setSelected(true);
  /**
   * Handler para perda de foco do input.
   */
  const onBlurHandler = () => setSelected(false);
  if (!cycle) return null;
  return (
    <View
      style={{
        ...style.container,
        ...(selected ? style.selectedContainer : undefined),
      }}
    >
      <View style={style.cycleContainer}>
        <LabeledInput
          containerStyle={{ flex: 1 }}
          size="big"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onNameChange}
          value={name}
        />
        <LabeledInput
          containerStyle={{ flex: 1 }}
          size="big"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onDurationChange}
          keyboardType="number-pad"
          value={String(duration)}
        />
      </View>
      {selected ? (
        <Button style={style.button} size="small" onPress={onDeleteHandler}>
          Apagar {/* TODO adicionar multi language */}
        </Button>
      ) : undefined}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  button: {
    width: "25%",
    alignSelf: "flex-end",
    justifyContent: "center",
    height: 28,
    padding: 0,
  },
  cycleContainer: {
    flexDirection: "row",
    gap: 8,
    height: 28,
  },
  selectedContainer: {
    borderRadius: 8,
    backgroundColor: "#76AEC6",
  },
});
