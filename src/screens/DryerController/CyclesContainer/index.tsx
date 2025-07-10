import {
  View,
  ViewProps,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DryerCycle } from "types/dryer";
import CycleInput from "./CycleInput";

/**
 * Props para o container de ciclos de um dryer.
 * - cycles: array de ciclos atuais
 * - setCycles: função para atualizar o array de ciclos
 */
type CyclesContainerProps = {
  cycles: DryerCycle[];
  setCycles: (cycles: DryerCycle[]) => void;
};

/**
 * Componente que exibe e gerencia a lista de ciclos de um dryer.
 * Permite adicionar, editar e remover ciclos.
 */
export default function CyclesContainer(
  props: CyclesContainerProps & ViewProps
) {
  const { cycles, setCycles } = props;

  /**
   * Atualiza um ciclo específico no array.
   */
  const updateCycle = (
    updatedCycle: { name?: string; duration?: number },
    updatedCycleIdx: Number
  ) => {
    const { name, duration } = updatedCycle;

    setCycles(
      cycles.map((cycle, idx) => {
        if (idx != updatedCycleIdx) return cycle;
        return {
          name: name !== undefined ? name : cycle.name,
          duration: duration !== undefined ? duration : cycle.duration,
        };
      })
    );
  };

  /**
   * Remove um ciclo pelo índice.
   */
  const removeCycle = async (cycleIdx: number) => {
    setCycles(cycles.filter((_, idx) => idx != cycleIdx));
  };

  /**
   * Adiciona um novo ciclo vazio.
   */
  const addCycleHandler = () => {
    const newCycle: DryerCycle = { name: "", duration: 0 };
    setCycles([...cycles, newCycle]);
  };

  return (
    <View style={styles.container} {...props}>
      <Text style={styles.title}>Ciclos</Text>
      <View>
        {cycles.map((cycle, idx) => (
          <CycleInput
            updateCycle={updateCycle}
            removeCycle={removeCycle}
            cycle={cycle}
            id={String(idx)}
            key={idx}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addCycleHandler}>
        <Text style={styles.addButtonText}>Adicionar Ciclo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#43a047",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 8,
    alignSelf: "flex-end",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
