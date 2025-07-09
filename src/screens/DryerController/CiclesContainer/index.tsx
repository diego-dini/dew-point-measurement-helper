import {
  View,
  ViewProps,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { DryerCicle } from "types/dryer";
import CicleInput from "./CicleInput";

/**
 * Props para o container de ciclos de um dryer.
 * - cicles: array de ciclos atuais
 * - setCicles: função para atualizar o array de ciclos
 */
type CiclesContainerProps = {
  cicles: DryerCicle[];
  setCicles: (cicles: DryerCicle[]) => void;
};

/**
 * Componente que exibe e gerencia a lista de ciclos de um dryer.
 * Permite adicionar, editar e remover ciclos.
 */
export default function CiclesContainer(
  props: CiclesContainerProps & ViewProps
) {
  const { cicles, setCicles } = props;

  /**
   * Atualiza um ciclo específico no array.
   */
  const updateCicle = (
    updatedCicle: { name?: string; duration?: number },
    updatedCicleIdx: Number
  ) => {
    const { name, duration } = updatedCicle;

    setCicles(
      cicles.map((cicle, idx) => {
        if (idx != updatedCicleIdx) return cicle;
        return {
          name: name !== undefined ? name : cicle.name,
          duration: duration !== undefined ? duration : cicle.duration,
        };
      })
    );
  };

  /**
   * Remove um ciclo pelo índice.
   */
  const removeCicle = async (cicleIdx: number) => {
    setCicles(cicles.filter((_, idx) => idx != cicleIdx));
  };

  /**
   * Adiciona um novo ciclo vazio.
   */
  const addCicleHandler = () => {
    const newCicle: DryerCicle = { name: "", duration: 0 };
    setCicles([...cicles, newCicle]);
  };

  return (
    <View style={styles.container} {...props}>
      <Text style={styles.title}>Ciclos</Text>
      <View>
        {cicles.map((cicle, idx) => (
          <CicleInput
            updateCicle={updateCicle}
            removeCicle={removeCicle}
            cicle={cicle}
            id={String(idx)}
            key={idx}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addCicleHandler}>
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
