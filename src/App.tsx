import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Header from "./elements/Header";
import React, { useState, ReactNode } from "react";
import { LoadingProvider } from "elements/LoadingContext";

export default function App() {
  const [body, setBody] = useState<ReactNode>(null);
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
