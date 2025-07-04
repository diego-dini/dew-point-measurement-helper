import {
  View,
  TextInputProps,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

/**
 * Exibe informações básicas do desumidificador selecionado.
 * Mostra o ID e permite editar o nome.
 */
type DryerInformationProps = {
  dryerId: number | undefined;
  dryerName: string;
};

export default function DryerInformation(
  props: DryerInformationProps & TextInputProps
) {
  const { dryerId, dryerName } = props;
  return (
    <View style={styles.infoCard}>
      {/* Exibe o ID do dryer ou "Novo" se for criação */}
      <Text style={styles.label}>{`Id: ${dryerId || "Novo"}`}</Text>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Name: </Text>
        {/* Input controlado para o nome do dryer */}
        <TextInput {...props} value={dryerName} style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#f8fafd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    padding: 8,
    color: "#222",
    flex: 1,
    minWidth: 80,
    maxWidth: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
