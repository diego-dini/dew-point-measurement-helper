import Button from "elements/Button";
import CardDisplayPrimary from "elements/CardDisplayPrimary";
import LabeledDisplay from "elements/LabeledDisplay";
import LabeledInput from "elements/LabeledInput";
import Loading from "elements/Loading";
import { View, Text, Keyboard } from "react-native";
import { useLoading } from "contexts/LoadingContext";
import { useNotification } from "contexts/NotificationContext";
import { useEffect, useReducer, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  UpdateNextMeasurementProvider,
  useUpdateNextMeasurement,
} from "contexts/UpdateNextMeasurementContext";
import MeasurementReducer from "reducers/measurementReducer";
import storage from "utils/storage";
import { MeasurementContext } from "contexts/MeasurementContext";
import DryerSelector from "elements/DryerSelector";
import { DryerContext } from "contexts/DryerContext";
import dryerReducer, { initialState } from "reducers/dryerReducer";
import { timestampToDDMMYYYY, timestampToHHMMSS } from "utils/time";
import CardDisplaySecondary from "elements/CardDisplaySecondary";
import TowerDisplay from "./TowerDisplay";
import { MeasurementStatus } from "types/measurement";
import UpdateNextMeasurement from "elements/UpdateNextMeasurement";

export default function Measurement() {
  const [state, dispatch] = useReducer(
    MeasurementReducer,
    storage.getBlankCurrentMeasurement()
  );
  const [dryerState, dryerDispatch] = useReducer(dryerReducer, initialState);
  const [valid, setValid] = useState<boolean>(false);
  const [nextMeasurementInput, setNextMeasurementInput] = useState<string>("");
  const [editNextMeasurement, setEditNextMeasurement] =
    useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());

  const notification = useNotification();

  useEffect(() => {
    storage.getCurrentMeasurement().then(async (response) => {
      if (!response) return dispatch({ type: "NEW" });
      dispatch({ type: "SET-MEASUREMENT", value: response.measurement });
      dispatch({
        type: "SET-NEXT-MEASUREMENT",
        value: response.nextMeasurement,
      });
      if (response.measurement.dryer == 0) return;
      const dryer = (
        await storage.getDryers({ id: response.measurement.dryer })
      )[0];
      dryerDispatch({ type: "SET_DRYER", value: dryer });
    });
  }, []);

  useEffect(() => {
    createNotification();
    if (state.measurement.date == 0) return setValid(false);
    if (state.measurement.dryer == 0) return setValid(false);
    storage.saveCurrentMeasurement(state);
    if (state.measurement.towers.left == 0) return setValid(false);
    if (state.measurement.towers.right == 0) return setValid(false);
    setValid(true);
  }, [state]);

  useEffect(() => {
    if (!dryerState) return;
    dispatch({ type: "UPDATE-DRYER-ID", value: dryerState.id });
  }, [dryerState]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Agenda notificação para próxima troca de torre, se aplicável
   */
  const createNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const nextTowerSwitch = state.nextMeasurement;
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

  const endMesurement = () => {
    if (state.measurement.date == 0) return setValid(false);
    if (state.measurement.dryer == 0) return setValid(false);
    if (state.measurement.towers.left == 0) return setValid(false);
    if (state.measurement.towers.right == 0) return setValid(false);
    notification.setNotification({
      visible: true,
      text: "Finalizar medição ?",
      onConfirm: () => {
        storage.addMeasurement({
          ...state.measurement,
          status: MeasurementStatus.COMPLETE,
        });
        dispatch({ type: "NEW" });
        dryerDispatch({ type: "CLEAR_DRYER" });
        storage.saveCurrentMeasurement(storage.getBlankCurrentMeasurement());
        notification.setNotification({ visible: false });
      },
      onCancel: () => notification.setNotification({ visible: false }),
    });
  };
  const cancelMeasurement = async () => {
    if (
      state.measurement.dryer != 0 &&
      (state.measurement.towers.left != 0 ||
        state.measurement.towers.right != 0)
    ) {
      notification.setNotification({
        visible: true,
        text: "Deseja cancelar a medição ?",
        onConfirm: async () => {
          await storage.addMeasurement({
            ...state.measurement,
            status: MeasurementStatus.CANCELED,
          });
          dispatch({ type: "NEW" });
          dryerDispatch({ type: "CLEAR_DRYER" });
          storage.saveCurrentMeasurement(storage.getBlankCurrentMeasurement());
          notification.setNotification({ visible: false });
        },
        onCancel: async () => {
          notification.setNotification({ visible: false });
        },
      });
    } else {
      notification.setNotification({
        visible: true,
        text: "Deseja limpar a medição ?",
        onConfirm: async () => {
          await storage.addMeasurement({
            ...state.measurement,
            status: MeasurementStatus.CANCELED,
          });
          dispatch({ type: "NEW" });
          dryerDispatch({ type: "CLEAR_DRYER" });
          storage.saveCurrentMeasurement(storage.getBlankCurrentMeasurement());
          notification.setNotification({ visible: false });
        },
        onCancel: async () => {
          notification.setNotification({ visible: false });
        },
      });
    }
  };
  return (
    <MeasurementContext.Provider value={{ state, dispatch }}>
      <CardDisplayPrimary>
        <DryerContext.Provider
          value={{ state: dryerState, dispatch: dryerDispatch }}
        >
          <DryerSelector />
        </DryerContext.Provider>
        <LabeledDisplay
          labelValue="Data"
          value={timestampToDDMMYYYY(state.measurement.date)}
        ></LabeledDisplay>
        <TowerDisplay />
        <View>
          {!editNextMeasurement ? (
            <LabeledDisplay labelValue="Proxima Medição">
              {!state.nextMeasurement ||
              state.nextMeasurement == 0 ||
              Number.isNaN(state.nextMeasurement)
                ? ""
                : timestampToHHMMSS(state.nextMeasurement - now)}
            </LabeledDisplay>
          ) : (
            <LabeledInput
              keyboardType="number-pad"
              labelValue="Proxima Medição"
              value={nextMeasurementInput}
              onChange={(e) => {
                setNextMeasurementInput(e.nativeEvent.text);
              }}
              onBlur={() => {
                setEditNextMeasurement(false);
                dispatch({
                  type: "SET-NEXT-MEASUREMENT",
                  value: Number(nextMeasurementInput) * 1000 + Date.now(),
                });
                setNextMeasurementInput("");
              }}
            />
          )}

          <Button
            color="green"
            size="medium"
            onPress={() => {
              Keyboard.dismiss();
              setEditNextMeasurement((prev) => !prev);
            }}
          >
            {!editNextMeasurement ? "Mudar Próxima Medição" : "Cancelar"}
          </Button>
        </View>
        <Button disabled={!valid} color="green" onPress={endMesurement}>
          Finalizar
        </Button>
        <Button onPress={cancelMeasurement}>
          {valid ? "Cancelar" : "Limpar"}
        </Button>
      </CardDisplayPrimary>
    </MeasurementContext.Provider>
  );
}
