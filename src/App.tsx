import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Header from "./elements/Header";
import React, { useState, ReactNode } from "react";
import { LoadingProvider } from "elements/LoadingContext";

/**
 * Componente principal da aplicação.
 * Configura a estrutura básica da UI com:
 * - SafeAreaView para compatibilidade com diferentes dispositivos
 * - LoadingProvider para contexto global de loading
 * - Header para navegação
 * - Área dinâmica para conteúdo das telas
 */
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
