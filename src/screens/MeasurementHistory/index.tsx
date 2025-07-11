import { ScrollView, TouchableOpacity } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import { Measurement } from "types/measurement";
import storage from "utils/storage";
import DefaultCardContainer from "elements/DefaultCard";
import MeasurementEntry from "./MeasurementEntry";
import LabeledTextInput from "elements/LabeledTextInput";
import { ddmmyyyyToTimestamp } from "utils/time";
import { Dryer } from "types/dryer";
import DryerSelector from "elements/DryerSelector";
import LabeledText from "elements/LabeledText";

/**
 * Tela de histórico de medições.
 * Permite filtrar medições por data e exibe lista de registros encontrados.
 */
export default function MeasurementHistoryScreen(): ReactNode {
  // Lista de medições filtradas
  const [measurementHistory, setMeasurementHistory] = useState<Measurement[]>(
    []
  );
  // Data alvo para filtro (formato DD/MM/AAAA)
  const [targetDate, setTargetDate] = useState<string>("");
  const [targetDryer, setTargetDryer] = useState<Dryer | null>(null);
  const [selectTargetDryer, setSelectTargetDryer] = useState<boolean>(false);

  // Carrega todas as medições ao montar
  useEffect(() => {
    storage.getMeasurements().then((measurements) => {
      setMeasurementHistory(measurements);
    });
  }, []);

  // Atualiza lista ao alterar data alvo
  useEffect(() => {
    let targetTimeStampStart = 0
    let targetTimeStampEnd = 0
    if (!targetDate || targetDate.length == 10) {
      targetTimeStampStart = ddmmyyyyToTimestamp(targetDate);
      targetTimeStampEnd = targetTimeStampStart + 86400000;
    }
    storage
      .getMeasurements({
        startDate: targetTimeStampStart > 0 ? targetTimeStampStart : undefined,
        endDate: targetTimeStampStart > 0 ? targetTimeStampEnd : undefined,
        dryer: targetDryer ? targetDryer.id : undefined,
      })
      .then((measurements) => {
        setMeasurementHistory(measurements);
      });
  }, [targetDate, targetDryer]);

  /**
   * Atualiza o campo de data alvo, formatando para DD/MM/AAAA
   * @param text Texto digitado
   */
  const updateTargetDate = (text: string) => {
    const clearDate = text
      .replace(/\D/g, "") // Deixa apenas numeros
      .replace(/^0+/, "") // Remove todos os 0 a esquerda
      .padStart(8, "0"); // Completa com 0 até chegar a 8 digitos
    const year = clearDate.slice(-4);
    const month = clearDate.slice(2, 4);
    const day = clearDate.slice(0, 2);
    setTargetDate((prev) => {
      if (clearDate.length > 8) return prev;
      return `${day}/${month}/${year}`;
    });
  };

  return (
    <DefaultCardContainer>
      <LabeledTextInput
        keyboardType="number-pad"
        labelValue="Data da Medição"
        onChange={(e) => updateTargetDate(e.nativeEvent.text)}
        value={targetDate}
      />
      <TouchableOpacity
        onPress={() => {
          setTargetDryer(null);
          setSelectTargetDryer(true);
        }}
      >
        <LabeledText labelValue="Desumidificador" value={targetDryer?.name} />
      </TouchableOpacity>

      {selectTargetDryer ? (
        <DryerSelector
          setDryer={(dryer: Dryer) => {
            setTargetDryer(dryer);
            setSelectTargetDryer(false);
          }}
        />
      ) : undefined}
      <ScrollView>
        {measurementHistory
          ? measurementHistory.map((measurement, idx) => (
              <MeasurementEntry measurement={measurement} key={idx} />
            ))
          : undefined}
      </ScrollView>
    </DefaultCardContainer>
  );
}
