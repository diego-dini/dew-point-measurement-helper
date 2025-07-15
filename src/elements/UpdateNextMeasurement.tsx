import { View, Text, StyleSheet, GestureResponderEvent } from "react-native";
import Overlay from "./Overlay";
import Button from "./Button";
import { useUpdateNextMeasurement } from "Context/UpdateNextMeasurementContext";
import FloatingContainerHeader from "./FloatingContainerHeader";
import CardDisplaySecondary from "./CardDisplaySecondary";
import LabeledInput from "./LabeledInput";
import { useState } from "react";

/**
 * Propriedades do componente UpdateNextMeasurement.
 *
 * @property visible - Define se o modal está visível.
 * @property onConfirm - Função chamada ao confirmar.
 */

/**
 * Propriedades do componente UpdateNextMeasurement.
 *
 * @property visible - Define se o modal está visível.
 * @property onConfirm - Função chamada ao confirmar, recebe o timestamp da próxima medição em milissegundos.
 */
export interface UpdateNextMeasurementProps {
  visible: boolean;
  onConfirm?: (nextMeasurementTimestamp: number) => void;
}

/**
 * Componente de modal para atualizar a próxima medição.
 *
 * Exibe campos de input e botões de ação em um overlay.
 *
 * @param visible - Define se o modal está visível.
 * @param onConfirm - Função chamada ao confirmar.
 */

/**
 * Componente de modal para atualizar a próxima medição.
 *
 * Exibe um overlay com campos de input e botões de ação para definir o tempo da próxima medição.
 *
 * @param visible - Define se o modal está visível.
 * @param onConfirm - Função chamada ao confirmar, recebe o timestamp da próxima medição em milissegundos.
 *
 * @example
 * <UpdateNextMeasurement visible={true} onConfirm={(timestamp) => { ... }} />
 */
export default function UpdateNextMeasurement({
  visible,
  onConfirm = () => {},
}: UpdateNextMeasurementProps) {
  // Hook do contexto para controlar a visibilidade do modal
  const setUpdateNextMeasurement =
    useUpdateNextMeasurement().setUpdateNextMeasurement;
  // Estado local para armazenar os segundos digitados
  const [seconds, setSeconds] = useState<number>(0);
  // Não renderiza nada se não estiver visível
  if (!visible) return null;
  return (
    <Overlay>
      <View style={style.container}>
        <FloatingContainerHeader>
          Atualizar Próxima Medição
        </FloatingContainerHeader>
        <View style={style.subContainer}>
          <CardDisplaySecondary>
            {/* Campo de input para segundos */}
            <LabeledInput
              size="medium"
              labelValue="Segundos"
              keyboardType="number-pad"
              onChange={(e) => setSeconds(Number(e.nativeEvent.text))}
            />
          </CardDisplaySecondary>
          <View style={style.buttonContainer}>
            {/* Botão de cancelar */}
            <Button
              size="medium"
              color="red"
              onPress={() => setUpdateNextMeasurement({ visible: false })}
            >
              Cancelar
            </Button>
            {/* Botão de confirmar */}
            <Button
              size="medium"
              color="green"
              onPress={() => onConfirm(seconds * 1000 + Date.now())}
            >
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    </Overlay>
  );
}

// Estilos do componente UpdateNextMeasurement
const style = StyleSheet.create({
  container: {
    backgroundColor: "#D0DBF9",
    borderRadius: 8,
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  subContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "column",
    padding: 8,
    gap: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    columnGap: 4,
  },
  text: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    height: 156,
    width: 240,
  },
});
