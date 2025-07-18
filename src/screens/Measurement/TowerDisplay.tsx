import CardDisplaySecondary from "elements/CardDisplaySecondary";
import CardDisplayTertiary from "elements/CardDisplayTertiary";
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useDryer } from "contexts/DryerContext";
import Button from "elements/Button";
import LabeledInput from "elements/LabeledInput";
import { useMeasurement } from "contexts/MeasurementContext";
import { useEffect, useState } from "react";

/**
 * Componente que exibe e gerencia os ciclos do desumidificador.
 *
 * Renderiza a lista de ciclos, títulos e botão para adicionar novo ciclo.
 */
export default function TowerDisplay() {
  const measurementContext = useMeasurement();
  const { towers } = measurementContext.state.measurement;
  const [leftValue, setLeftValue] = useState<string>(
    String(towers.left).replace(".", ",")
  );
  const [rightValue, setRightValue] = useState<string>(
    String(towers.right).replace(".", ",")
  );

  useEffect(() => {
    setLeftValue(String(towers.left).replace(".", ","));
    setRightValue(String(towers.right).replace(".", ","));
  }, [towers]);

  const onChangeHandler = (
    tower: "left" | "right",
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const text = e.nativeEvent.text;
    const isNegative = text.includes("-");
    const clearText = text.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = Number(clearText);
    if (isNaN(num)) return;

    const value = isNegative ? num * -1 : num;
    measurementContext.dispatch({ type: "UPDATE-TOWER", tower, value });
  };

  return (
    <View>
      {/* TODO adicionar multi language */}
      <Text style={style.title}>Torres</Text>
      <CardDisplaySecondary>
        <CardDisplayTertiary style={style.towersEntryContainer}>
          <LabeledInput
            keyboardType="number-pad"
            labelValue="Esquerda"
            value={leftValue}
            containerStyle={style.inputField}
            onChange={(e) => onChangeHandler("left", e)}
          />
          <LabeledInput
            keyboardType="number-pad"
            labelValue="Direita"
            value={rightValue}
            containerStyle={style.inputField}
            onChange={(e) => onChangeHandler("right", e)}
          />
        </CardDisplayTertiary>
      </CardDisplaySecondary>
    </View>
  );
}

const style = StyleSheet.create({
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
    fontSize: 24,
  },
  subTitle: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 5,
    fontSize: 20,
    flex: 1,
  },
  towersContainer: {
    flexDirection: "row",
    gap: 8,
  },
  towersEntryContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputField: {
    flex: 1,
  },
});
