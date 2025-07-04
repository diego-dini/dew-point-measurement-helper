import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import storage from "utils/storage";
import { Dryer, DryerCicle } from "types/dryer";
import DryerButton from "./DryerButton";
import CiclesContainer from "./CiclesContainer";
import { useLoading } from "elements/LoadingContext";
import DryerInformation from "./DryerInformation";

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
  const [cicles, setCicles] = useState<DryerCicle[]>([]);
  const { setLoading } = useLoading();

  /**
   * Seleciona um dryer e preenche o formulário com seus dados.
   */
  const updateSelectedDryer = (dryer: Dryer) => {
    Keyboard.dismiss();
    setId(dryer.id);
    setName(dryer.name);
    setCicles(dryer.cicles);
    setShowButtons(false);
  };

  /**
   * Salva ou atualiza um dryer no storage.
   * Mostra loading durante a operação.
   */
  const saveHandler = async () => {
    Keyboard.dismiss();

    setLoading(true, "Salvando...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const dryer = {
      id: Number(id),
      name,
      cicles,
    };
    if (dryer.id == 0 || dryer.id == undefined || Number.isNaN(dryer.id)) {
      // Gera novo id incremental
      const higherId =
        dryers.reduce((acc, dryer) => {
          return dryer.id > acc ? dryer.id : acc;
        }, 0) + 1;
      dryer.id = Number(higherId);

      await storage.addDryer(dryer);
    } else {
      await storage.updateDryer(dryer);
    }

    setDryers(await storage.getDryers());

    setLoading(false);
  };

  /**
   * Remove o dryer selecionado.
   * Mostra loading durante a operação.
   */
  const deleteHandler = async () => {
    Keyboard.dismiss();
    setLoading(true, "Removendo...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!id) return setLoading(false);
    await storage.removeDryer(id);
    setDryers(await storage.getDryers());
    setId(undefined);
    setName("");
    setCicles([]);
    setLoading(false);
  };

  const cleanHandler = async () => {
    Keyboard.dismiss();
    setLoading(true, "Limpando...");
    setDryers(await storage.getDryers());
    setId(undefined);
    setName("");
    setCicles([]);
    setLoading(false);
  };

  // Carrega dryers ao montar o componente
  useEffect(() => {
    storage.getDryers().then((dryers) => {
      setDryers(dryers);
    });
  }, []);

  return (
    <View style={style.container}>
      {/* Botão para mostrar/ocultar lista de dryers */}
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          style={style.toggleButton}
          onPress={() => setShowButtons((prev) => !prev)}
        >
          <Text style={style.toggleButtonText}>Desumidificadores</Text>
        </TouchableOpacity>
        {showButtons && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
          >
            {dryers.map((dryer, idx) => (
              <DryerButton
                setDryer={updateSelectedDryer}
                dryer={dryer}
                key={idx}
                style={{ marginBottom: 8 }}
              >
                {dryer.name}
              </DryerButton>
            ))}
          </View>
        )}
      </View>
      {/* Formulário de informações do dryer selecionado */}
      <View style={style.card}>
        <Text style={style.sectionTitle}>Informações</Text>
        <DryerInformation
          dryerId={Number.isNaN(id) ? undefined : Number(id)}
          dryerName={name}
          onChange={(e) => setName(e.nativeEvent.text)}
        />
        <CiclesContainer cicles={cicles} setCicles={setCicles} />
        {/* Botões de ação */}
        <View style={style.actionRow}>
          <TouchableOpacity style={style.button} onPress={cleanHandler}>
            <Text style={style.buttonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.button} onPress={deleteHandler}>
            <Text style={style.buttonText}>Apagar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.button} onPress={saveHandler}>
            <Text style={style.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
    zIndex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  button: {
    backgroundColor: "#1976d2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
  CicleInputView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    margin: 10,
  },
  CicleInputLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  CicleInput: {
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
