import CardDisplayPrimary from "elements/CardDisplayPrimary";
import DryerSelector from "elements/DryerSelector";
import { View, Keyboard } from "react-native";
import CycleContainer from "./CycleContainer";
import { DryerContext } from "contexts/DryerContext";
import Button from "elements/Button";
import { useEffect, useReducer, useState } from "react";
import storage from "utils/storage";
import dryerReducer, { initialState } from "reducers/dryerReducer";
import { Dryer } from "types/dryer";
import { useLoading } from "contexts/LoadingContext";
import { useNotification } from "contexts/NotificationContext";

/**
 * Tela principal para gerenciamento de desumidificadores e seus ciclos.
 */
export default function Dryers() {
  const [state, dispatch] = useReducer(dryerReducer, initialState);
  const [dryers, setDryers] = useState<Dryer[]>([]);
  const [edited, setEdited] = useState<boolean>(false);
  const Loading = useLoading();
  const Notification = useNotification();

  useEffect(() => {
    storage.getDryers().then((response) => setDryers(response));
  }, []);

  useEffect(() => {
    const id = state.id;
    const savedDryer = dryers?.find((dryer) => dryer.id == id) || {
      id: 0,
      name: "",
      cycles: [],
    };

    if (state.name.length == 0) return setEdited(false);

    if (savedDryer.name != state.name) return setEdited(true);

    if (savedDryer.cycles.length != state.cycles.length) return setEdited(true);
    const editeDryer = savedDryer.cycles.find((dryer, idx) => {
      const stateDryer = state.cycles[idx];
      if (
        dryer.name != stateDryer.name ||
        dryer.duration != stateDryer.duration
      ) {
        setEdited(true);
        return true;
      }
    });
    if (editeDryer) return;
    setEdited(false);
  }, [state]);

  /**
   * Salva o desumidificador editado ou novo.
   */
  const saveDryer = async () => {
    Loading.setLoading(true, "Salvando" /* TODO adicionar multi language */);

    if (state.id == 0) {
      const newId = dryers.reduce((acc, dryer) => {
        if (dryer.id >= acc) return dryer.id + 1;
        else return acc;
      }, 0);
      await storage.addDryer({ ...state, id: newId || state.id });
      dispatch({ type: "SET_ID", value: newId });
    } else {
      await storage.updateDryer(state);
    }

    const updatedDryers = await storage.getDryers();
    setDryers(updatedDryers);
    setEdited(false);
    Keyboard.dismiss();
    Loading.setLoading(false);
  };
  /**
   * Limpa o estado do desumidificador editado.
   */
  const clearDryer = () => {
    dispatch({ type: "CLEAR_DRYER" });
  };

  /**
   * Exibe notificação para apagar o desumidificador.
   */
  const deleteDryer = async () => {
    Notification.setNotification({
      visible: true,
      text: `Deseja apagar desumidificador ${state.name} ?` /* TODO adicionar multi language */,
      onConfirm: async () => {
        await storage.removeDryer(state.id);
        dispatch({ type: "CLEAR_DRYER" });
        const newDryers = await storage.getDryers();
        setDryers(newDryers);
        Notification.setNotification({ visible: false });
      },
      onCancel: () => Notification.setNotification({ visible: false }),
    });
  };

  return (
    <View>
      <CardDisplayPrimary>
        <DryerContext.Provider value={{ state, dispatch }}>
          <DryerSelector dryers={dryers} edited={edited} />
          <CycleContainer />
        </DryerContext.Provider>
        <Button disabled={!edited} color="green" onPress={saveDryer}>
          {
            state.id === 0
              ? "Criar" /* TODO adicionar multi language */
              : "Atualizar" /* TODO adicionar multi language */
          }
        </Button>
        <Button onPress={clearDryer}>
          {
            state.id === 0
              ? "Limpar" /* TODO adicionar multi language */
              : "Cancelar" /* TODO adicionar multi language */
          }
        </Button>
        {state.id != 0 ? (
          <Button onPress={deleteDryer}>
            Apagar {/* TODO adicionar multi language */}
          </Button>
        ) : undefined}
      </CardDisplayPrimary>
    </View>
  );
}
