import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import storage from "utils/storage";
import { Dryer, DryerCycle } from "types/dryer";
import DryerButton from "../../elements/DryerButton";
import CyclesContainer from "./CyclesContainer";
import { useLoading } from "elements/LoadingContext";
import DefaultButton from "elements/DefaultButton";
import DefaultContainer from "elements/DefaultContainer";
import DefaultCardContainer from "elements/DefaultCard";
import DefaultActionContainer from "elements/DefaultActionContainer";
import DryerSelector from "elements/DryerSelector";
import LabeledTextInput from "elements/LabeledTextInput";
import LabeledText from "elements/LabeledText";

/**
 * Tela de controle de desumidificadores.
 * Permite visualizar, editar, adicionar e remover dryers e seus ciclos.
 * Utiliza contexto global de loading para feedback visual.
 */
export default function DryerControllerScreen() {
  // Estados principais
  const [showButtons, setShowButtons] = useState(false);
  const [dryers, setDryers] = useState<Dryer[]>([]);
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<number>();
  const [cycles, setCyclesl] = useState<DryerCycle[]>([]);
  const { setLoading } = useLoading();

  const setCycles = (newCycles: DryerCycle[]) => {
    setCyclesl(newCycles);
  };

  /**
   * Seleciona um dryer e preenche o formulário com seus dados.
   */
  const updateSelectedDryer = (dryer: Dryer) => {
    Keyboard.dismiss();
    setId(dryer.id);
    setName(dryer.name);
    setCycles(dryer.cycles);
    setShowButtons(false);
  };

  /**
   * Salva ou atualiza um dryer no storage.
   * Mostra loading durante a operação.
   */
  const saveHandler = async () => {
    Keyboard.dismiss();

    setLoading(true, "Salvando...");

    const dryer = {
      id: Number(id),
      name,
      cycles,
    };

    const defaultCallback = async () => {
      const updatedDryers = await storage.getDryers();
      setDryers(updatedDryers);
      setLoading(false);
    };

    if (dryer.id == 0 || dryer.id == undefined || Number.isNaN(dryer.id)) {
      // Gera novo id incremental
      const higherId =
        dryers.reduce((acc, dryer) => {
          return dryer.id > acc ? dryer.id : acc;
        }, 0) + 1;
      dryer.id = Number(higherId);
      storage.addDryer(dryer).then(defaultCallback);
    } else {
      storage.updateDryer(dryer).then(defaultCallback);
    }
  };

  /**
   * Remove o dryer selecionado.
   * Mostra loading durante a operação.
   */
  const deleteHandler = async () => {
    Keyboard.dismiss();
    setLoading(true, "Removendo...");
    if (!id) return setLoading(false);
    await storage.removeDryer(id);
    setDryers(await storage.getDryers());
    setId(undefined);
    setName("");
    setCycles([]);
    setLoading(false);
  };

  const cleanHandler = async () => {
    Keyboard.dismiss();
    setLoading(true, "Limpando...");
    setDryers(await storage.getDryers());
    setId(undefined);
    setName("");
    setCycles([]);
    setLoading(false);
  };

  // Carrega dryers ao montar o componente
  useEffect(() => {
    storage.getDryers().then((dryers) => {
      setDryers(dryers);
    });
  }, []);

  return (
    <DefaultContainer>
      <DefaultCardContainer>
        <Text style={style.sectionTitle}>Informações</Text>
        <LabeledTextInput
          labelValue="Desumidificador"
          value={name}
          onChange={(e) => setName(e.nativeEvent.text)}
          onFocus={(e) => setShowButtons(true)}
          onBlur={(e) => setShowButtons(false)}
        ></LabeledTextInput>
        {showButtons ? (
          <DryerSelector setDryer={updateSelectedDryer} />
        ) : undefined}
        <CyclesContainer cycles={cycles || []} setCycles={setCycles} />
        <DefaultActionContainer>
          <DefaultButton onPress={saveHandler}>Salvar</DefaultButton>

          <DefaultButton onPress={deleteHandler}>Apagar</DefaultButton>
          <DefaultButton onPress={cleanHandler}>Limpar</DefaultButton>
        </DefaultActionContainer>
      </DefaultCardContainer>
    </DefaultContainer>
  );
}

const style = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  NameInputView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    margin: 10,
  },
  NameInputLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  NameInput: {
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
  CycleInputView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    margin: 10,
  },
  CycleInputLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  CycleInput: {
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
  toggleButton: {
    backgroundColor: "#1976d2",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 2,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
