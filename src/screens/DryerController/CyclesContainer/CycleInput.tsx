import LabeledTextInput from "elements/LabeledTextInput";
import { useState, useEffect } from "react";
import {
  View,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
  Text,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { DryerCycle } from "types/dryer";

/**
 * Props para o input de ciclo individual.
 * - id: índice do ciclo
 * - cycle: dados do ciclo
 * - updateCycle: função para atualizar o ciclo
 * - removeCycle: função para remover o ciclo
 */
type CycleInputProps = {
  id: string;
  cycle: DryerCycle;
  updateCycle: (
    updatedCycle: { name?: string; duration?: number },
    updatedCycleIdx: Number
  ) => void;
  removeCycle: (cycleIdx: number) => void;
};

/**
 * Componente de input para edição de um ciclo de dryer.
 * Permite editar nome e duração, e remover o ciclo.
 */
export default function CycleInput(props: CycleInputProps & ViewProps) {
  const { cycle, updateCycle, removeCycle } = props;
  const [name, setName] = useState(cycle.name);
  const [duration, setDuration] = useState(cycle.duration);
  const [isFocus, setIsFocus] = useState(false);

  // Sincroniza o estado local com as props ao trocar de ciclo
  useEffect(() => {
    setName(cycle.name);
    setDuration(cycle.duration);
  }, [cycle.name, cycle.duration, props.id]);

  /**
   * Handler para mudança do nome
   */
  const nameChangeHandler = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const name = e.nativeEvent.text;
    updateCycle({ name }, Number(props.id));
  };

  /**
   * Handler para mudança da duração
   */
  const durationChangeHandler = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const text = e.nativeEvent.text;
    if (!Number.isNaN(text)) {
      updateCycle({ duration: Number(text) }, Number(props.id));
    }
  };

  return (
    <View style={styles.cycleCard} id={props.id}>
      <LabeledTextInput
        labelValue="Nome"
        value={name}
        style={styles.input}
        onChange={nameChangeHandler}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <LabeledTextInput
        labelValue="Duração"
        keyboardType="number-pad"
        value={String(duration)}
        style={styles.input}
        onChange={durationChangeHandler}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      {isFocus && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            removeCycle(Number(props.id));
          }}
        >
          <Text style={styles.deleteButtonText}>Apagar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cycleCard: {
    backgroundColor: "#f8fafd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    padding: 8,
    color: "#222",
    flex: 1,
    minWidth: 60,
    maxWidth: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#e53935",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
