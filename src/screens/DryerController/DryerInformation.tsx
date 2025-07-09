import LabeledText from "elements/LabeledText";
import LabeledTextInput from "elements/LabeledTextInput";
import { View, TextInputProps, StyleSheet } from "react-native";

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
      <LabeledText labelStyle={{ minWidth: 60 }} labelValue="ID">
        {dryerId || "Novo"}
      </LabeledText>
      <LabeledTextInput
        labelStyle={{ minWidth: 60 }}
        labelValue="Nome"
        {...props}
        value={dryerName}
      />
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
});
