import { View, Text, StyleSheet } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import {
  CurrentMeasurement,
  Measurement,
  MeasurementStatus,
} from "types/measurement";
import LabeledTextInput from "elements/LabeledTextInput";
import LabeledText from "elements/LabeledText";
import { Dryer } from "types/dryer";
import storage from "utils/storage";
import DryerButton from "elements/DryerButton";
import { timestampToDDMMYYYY, timestampToHHMMSS } from "utils/time";
import DefaultButton from "elements/DefaultButton";
import DefaultContainer from "elements/DefaultContainer";
import DefaultActionContainer from "elements/DefaultActionContainer";
import DefaultCardContainer from "elements/DefaultCard";
import TowersContainer from "./TowersContainer";
import * as Notifications from "expo-notifications";
import { useLoading } from "elements/LoadingContext";
import DryerSelector from "elements/DryerSelector";

/**
 * Tela principal de controle de medições.
 * Permite selecionar desumidificador, registrar medições, controlar torres e agendar notificações.
 */
export default function MeasurementControllerScreen(): ReactNode {
  // Estado da medição atual
  const [currentMeasurement, setcurrentMeasurement] =
    useState<CurrentMeasurement>(storage.getBlankCurrentMeasurement());
  // Lista de desumidificadores disponíveis
  const [dryers, setDryers] = useState<Dryer[]>([]);
  // Controle de foco para seleção de desumidificador
  const [selectDryerFocus, setSelectDryerFocus] = useState(false);
  // Timestamp atual (atualizado a cada segundo)
  const [now, setNow] = useState<number>(Date.now());

  const { setLoading } = useLoading();

  /**
   * Carrega dados iniciais do storage (desumidificadores e medição atual)
   */
  const loadData = async (): Promise<void> => {
    setLoading(true, "Carregando...");
    const loadedDryers = await storage.getDryers();
    const loadedCurrentMeasurement = await storage.getCurrentMeasurement();
    setDryers(loadedDryers);
    setcurrentMeasurement(loadedCurrentMeasurement);
    setLoading(false);
  };

  /**
   * Atualiza o estado da medição atual e persiste no storage
   * @param obj Campos a atualizar na medição
   */
  const updateCurrentMeasurement = async (obj: {
    id?: number;
    date?: number;
    dryerId?: number;
    leftTower?: number;
    rigthTower?: number;
    next?: number;
  }): Promise<void> => {
    const { id, date, dryerId, leftTower, rigthTower, next } = obj;
    const cMeasurement =
      currentMeasurement || (await storage.getCurrentMeasurement());

    const newMeasurement: Measurement = {
      id: id ?? cMeasurement.measurement.id,
      date: date ?? cMeasurement.measurement.date,
      dryer: dryerId ?? cMeasurement.measurement.dryer,
      towers: {
        left:
          leftTower !== undefined
            ? leftTower
            : cMeasurement.measurement.towers.left,
        right:
          rigthTower !== undefined
            ? rigthTower
            : cMeasurement.measurement.towers.right,
      },
      status: MeasurementStatus.ONGOING,
    };
    const newCurrentMeasurement: CurrentMeasurement = {
      measurement: newMeasurement,
      nextTowerSwitchTime: next ?? cMeasurement.nextTowerSwitchTime,
    };
    setcurrentMeasurement(newCurrentMeasurement);
    storage.saveCurrenMeasurement(newCurrentMeasurement);
  };

  /**
   * Agenda notificação para próxima troca de torre, se aplicável
   */
  const createNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const nextTowerSwitch = currentMeasurement.nextTowerSwitchTime;
    if (nextTowerSwitch === null || nextTowerSwitch - Date.now() <= 0) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        interruptionLevel: "critical",
        title: "Hora da próxima medição!",
        body: "Realize a próxima medição agora.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.ceil((nextTowerSwitch - Date.now()) / 1000),
      },
    });
  };

  // Carrega dados ao montar
  useEffect(() => {
    loadData();
  }, []);

  // Atualiza timestamp atual a cada segundo
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Agenda notificação ao alterar medição
  useEffect(() => {
    createNotification();
  }, [currentMeasurement]);

  /**
   * Finaliza a medição atual, salva no histórico e reseta estado
   */
  const closeCurrentMeasurement = async (): Promise<void> => {
    setLoading(true, "Finalizando...");
    const measurement = { ...currentMeasurement.measurement };
    if (measurement.dryer === 0) {
      alert("Não é possivel finalizar uma medição sem um desumidificador");
      setLoading(false);
      return;
    }
    if (measurement.towers.left === 0 && measurement.towers.right === 0) {
      alert("Não é possivél finalizar um medição sem ambas as torres.");
      setLoading(false);
      return;
    }
    measurement.status = MeasurementStatus.COMPLETE;
    await storage.addMeasurement(measurement);
    const blankCurrentMeasurement = storage.getBlankCurrentMeasurement();
    setcurrentMeasurement(blankCurrentMeasurement);
    await storage.saveCurrenMeasurement(blankCurrentMeasurement);
    setLoading(false);
  };

  /**
   * Cancela a medição atual, salva como cancelada se aplicável e reseta estado
   */
  const cancelCurrentMeasurement = async (): Promise<void> => {
    setLoading(true, "Cancelando...");
    const measurement = { ...currentMeasurement.measurement };
    if (
      measurement.dryer !== 0 &&
      currentMeasurement.nextTowerSwitchTime !== 0
    ) {
      measurement.status = MeasurementStatus.CANCELED;
      await storage.addMeasurement(measurement);
    }
    const blankCurrentMeasurement = storage.getBlankCurrentMeasurement();
    setcurrentMeasurement(blankCurrentMeasurement);
    await storage.saveCurrenMeasurement(blankCurrentMeasurement);
    setLoading(false);
  };

  return (
    <DefaultContainer>
      <DefaultCardContainer>
        <LabeledText
          labelValue="Desumidificador"
          style={{
            backgroundColor: "#f0f0f0",
            color: "#222",
            borderColor: "#ccc",
          }}
          value={
            dryers.find(
              (dryer) => dryer.id === currentMeasurement.measurement.dryer
            )?.name || ""
          }
          onPress={() => setSelectDryerFocus(true)}
        />
        {selectDryerFocus ? (
          <DryerSelector
            setDryer={(dryer: Dryer) => {
              updateCurrentMeasurement({ dryerId: dryer.id });
              setSelectDryerFocus(false);
            }}
          ></DryerSelector>
        ) : undefined}
        <LabeledText labelValue="Data da Medição">
          {timestampToDDMMYYYY(currentMeasurement.measurement.date)}
        </LabeledText>
        <DefaultCardContainer>
          <TowersContainer
            leftTower={currentMeasurement.measurement.towers.left}
            rigthTower={currentMeasurement.measurement.towers.right}
            setLeftTower={(value: number) =>
              updateCurrentMeasurement({ leftTower: value })
            }
            setRigthTower={(value: number) =>
              updateCurrentMeasurement({ rigthTower: value })
            }
          />
        </DefaultCardContainer>
        <LabeledText labelValue="Tempo para troca de torre">
          {currentMeasurement.nextTowerSwitchTime !== 0
            ? timestampToHHMMSS(currentMeasurement.nextTowerSwitchTime - now)
            : ""}
        </LabeledText>
        <LabeledTextInput
          labelValue="Segundo até troca de torre"
          keyboardType="number-pad"
          onChange={(e) =>
            updateCurrentMeasurement({
              next: Number(e.nativeEvent.text) * 1000 + now,
            })
          }
        />
        <DefaultActionContainer>
          <DefaultButton onPress={closeCurrentMeasurement}>
            Finalizar
          </DefaultButton>
          <DefaultButton onPress={cancelCurrentMeasurement}>
            Cancelar
          </DefaultButton>
        </DefaultActionContainer>
      </DefaultCardContainer>
    </DefaultContainer>
  );
}
