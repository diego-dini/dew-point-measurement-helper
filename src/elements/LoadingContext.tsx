import React, { createContext, useContext, useState, ReactNode } from "react";
import Loading from "elements/Loading";

interface LoadingContextType {
  setLoading: (visible: boolean, text?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);

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
