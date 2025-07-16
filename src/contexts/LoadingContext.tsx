import React, { createContext, useContext, useState, ReactNode } from "react";
import Loading from "../elements/Loading";

/**
 * Interface para o contexto de loading global da aplicação.
 */
interface LoadingContextType {
  setLoading: (visible: boolean, text?: string) => void;
}

/**
 * Contexto React para gerenciamento global do estado de loading.
 */
const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {},
});

/**
 * Hook personalizado para acessar o contexto de loading.
 * @returns Objeto com função setLoading para controlar o estado global de loading
 */
export function useLoading() {
  return useContext(LoadingContext);
}

/**
 * Provider do contexto de loading que envolve a aplicação.
 * Fornece estado global de loading com overlay visual.
 * @param children Componentes filhos que terão acesso ao contexto
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);

  /**
   * Controla a exibição do loading global.
   * @param v Visibilidade do loading (true/false)
   * @param t Texto opcional a ser exibido no loading
   */
  const setLoading = (v: boolean, t?: string) => {
    setVisible(v);
    setText(t);
  };

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      <Loading visible={visible} text={text} />
    </LoadingContext.Provider>
  );
}
