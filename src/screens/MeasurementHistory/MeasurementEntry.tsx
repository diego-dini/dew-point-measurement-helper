import { View, TouchableOpacity } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import { Measurement } from "types/measurement";
import LabeledText from "elements/LabeledText";
import storage from "utils/storage";
import { timestampToDDMMYYYY } from "utils/time";

/**
 * Props do componente MeasurementEntry
 * - measurement: objeto de medição a ser exibido
 */
type MeasurementEntryProps = {
  measurement: Measurement;
};

/**
 * Componente que exibe um registro de medição, com detalhes expansíveis.
 * Mostra data, desumidificador, valores das torres e status traduzido.
 */
export default function MeasurementEntry({
  measurement,
}: MeasurementEntryProps): ReactNode {
  const [dryerName, setDryerName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Busca nome do desumidificador ao montar ou mudar medição
  useEffect(() => {
    storage
      .getDryers({ id: measurement.dryer })
      .then((dryers) => setDryerName(dryers[0]?.name || ""));
  }, [measurement]);

  /**
   * Traduz status da medição para português amigável
   */
  function traduzirStatus(status: string): string {
    switch (status) {
      case "ongoing":
        return "Em andamento";
      case "complete":
        return "Concluída";
      case "canceled":
        return "Cancelada";
      default:
        return status;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerRow} onPress={() => setOpen(!open)}>
        <LabeledText
          labelValue="Data"
          containerStyle={[styles.cell, { flex: 2 }]}
          value={timestampToDDMMYYYY(measurement.date)}
        />
        <LabeledText
          labelValue="Desumidificador"
          containerStyle={[styles.cell, { flex: 3 }]}
          value={dryerName}
        />
      </TouchableOpacity>
      {open ? (
        <View style={styles.detailsBox}>
          <LabeledText labelValue="Torres" containerStyle={styles.towerRow}>
            <LabeledText
              labelValue="Direita"
              labelStyle={styles.towerLabel}
              value={measurement.towers.right}
              containerStyle={styles.towerCell}
            />
            <LabeledText
              labelValue="Esquerda"
              labelStyle={styles.towerLabel}
              value={measurement.towers.left}
              containerStyle={styles.towerCell}
            />
          </LabeledText>
          <LabeledText
            labelValue="Status"
            value={traduzirStatus(measurement.status)}
          />
        </View>
      ) : undefined}
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: "#f7fafd",
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 0,
  },
  cell: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    marginBottom: 0,
  },
  detailsBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    flexDirection: "column" as const,
    gap: 6,
  },
  towerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 4,
  },
  towerCell: {
    flex: 1,
    paddingHorizontal: 2,
  },
  towerLabel: {
    width: 70,
    fontWeight: "bold" as const,
    color: "#1976d2",
  },
};
