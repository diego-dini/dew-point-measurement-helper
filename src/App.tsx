import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Header from "./elements/Header";
import React, { useState, ReactNode, useEffect } from "react";
import { LoadingProvider } from "elements/LoadingContext";
import * as Notifications from "expo-notifications";

export default function App() {
  const [body, setBody] = useState<ReactNode>(null);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <LoadingProvider>
        <StatusBar backgroundColor="black" />
        <Header setBody={setBody} />
        <View style={{ flex: 1 }}>{body}</View>
      </LoadingProvider>
    </SafeAreaView>
  );
}
