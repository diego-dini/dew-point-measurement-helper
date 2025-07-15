import { ReactNode } from "react";
import { View, ViewProps, StyleSheet } from "react-native";

/**
 * Propriedades do componente MainView.
 *
 * @property children - Conteúdo a ser exibido dentro da view principal.
 * @property ...restProps - Outras props do View.
 */
interface MainViewProps extends ViewProps {
  children: ReactNode;
}

/**
 * Componente de view principal da aplicação.
 *
 * Envolve o conteúdo em uma view com fundo, padding e layout em coluna.
 *
 * @param children - Conteúdo da view.
 * @param restProps - Outras props do View.
 */
export default function MainView({ children, ...restProps }: MainViewProps) {
  return (
    <View style={style.container} {...restProps}>
      {children}
    </View>
  );
}

// Estilos do componente MainView
const style = StyleSheet.create({
  container: {
    backgroundColor: "#D0DBF9",
    padding: 8,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    gap: 8,
  },
});
