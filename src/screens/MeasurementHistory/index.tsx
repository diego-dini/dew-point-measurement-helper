import { ScrollView } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import { Measurement } from "types/measurement";
import storage from "utils/storage";
import DefaultCardContainer from "elements/DefaultCard";
import MeasurementEntry from "./MeasurementEntry";
import LabeledTextInput from "elements/LabeledTextInput";
import { ddmmyyyyToTimestamp } from "utils/time";

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

  // Carrega todas as medições ao montar
  useEffect(() => {
    storage.getMeasurements().then((measurements) => {
      setMeasurementHistory(measurements);
    });
  }, []);

  // Atualiza lista ao alterar data alvo
  useEffect(() => {
    if (!targetDate || targetDate.length !== 10) return;
    const targetTimeStampStart = ddmmyyyyToTimestamp(targetDate);
    const targetTimeStampEnd = targetTimeStampStart + 86400000;
    storage
      .getMeasurements({
        startDate: targetTimeStampStart,
        endDate: targetTimeStampEnd,
      })
      .then((measurements) => {
        setMeasurementHistory(measurements);
      });
  }, [targetDate]);

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
