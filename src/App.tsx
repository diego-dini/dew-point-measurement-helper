import { View, Text, SafeAreaView, StatusBar } from "react-native";
import React, { useState, ReactNode, useEffect } from "react";
import * as Notifications from "expo-notifications";
import Header from "elements/Header";
import MainView from "elements/MainView";
import Loading from "elements/Loading";
import { LoadingProvider, useLoading } from "Context/LoadingContext";
import { NotificationProvider } from "Context/NotificationContext";
import { UpdateNextMeasurementProvider } from "Context/UpdateNextMeasurementContext";

/**
 * Componente principal da aplicação.
 * Configura a estrutura básica da UI com:
 * - SafeAreaView para compatibilidade com diferentes dispositivos
 * - LoadingProvider para contexto global de loading
 * - Header para navegação
 * - Área dinâmica para conteúdo das telas
 */
export default function App() {
  const [body, setBody] = useState<ReactNode>();
  const loading = useLoading();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);
  // Handler global para exibir notificações mesmo com o app aberto

  return (
    <SafeAreaView>
      <LoadingProvider>
        <UpdateNextMeasurementProvider>
          <NotificationProvider>
            <MainView>
              <StatusBar backgroundColor={"#000b0d0a"} />
              <Header setBody={setBody} />
              {body}
            </MainView>
          </NotificationProvider>
        </UpdateNextMeasurementProvider>
      </LoadingProvider>
    </SafeAreaView>
  );
}
