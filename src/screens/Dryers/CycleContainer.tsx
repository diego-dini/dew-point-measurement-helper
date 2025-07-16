import CardDisplaySecondary from "elements/CardDisplaySecondary";
import CardDisplayTertiary from "elements/CardDisplayTertiary";
import { View, Text, StyleSheet } from "react-native";
import CycleEntry from "./CycleEntry";
import { useDryer } from "contexts/DryerContext";
import Button from "elements/Button";

/**
 * Componente que exibe e gerencia os ciclos do desumidificador.
 *
 * Renderiza a lista de ciclos, títulos e botão para adicionar novo ciclo.
 */
export default function CycleContainer() {
  const dryerContext = useDryer();
  const { cycles } = dryerContext.state;
  return (
    <View>
      {/* TODO adicionar multi language */}
      <Text style={style.title}>Ciclos</Text>
      <CardDisplaySecondary>
        <View style={style.cycleContainer}>
          {/* TODO adicionar multi language */}
          <Text style={style.subTitle}>Nome</Text>
          {/* TODO adicionar multi language */}
          <Text style={style.subTitle}>Duração</Text>
        </View>
        <CardDisplayTertiary style={style.cycleEntryContainer}>
          {cycles
            ? cycles.map((cycle, idx) => (
                <CycleEntry cycle={cycle} idx={idx} key={idx} />
              ))
            : undefined}
        </CardDisplayTertiary>
        <Button
          size="medium"
          color="green"
          style={{ margin: 8 }}
          onPress={() =>
            dryerContext.dispatch({
              type: "ADD_CYCLE",
              value: { name: "", duration: 0 },
            })
          }
        >
          {/* TODO adicionar multi language */}
          Adicionar
        </Button>
      </CardDisplaySecondary>
    </View>
  );
}

const style = StyleSheet.create({
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
    fontSize: 24,
  },
  subTitle: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 5,
    fontSize: 20,
    flex: 1,
  },
  cycleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  cycleEntryContainer: {
    flexDirection: "column",
  },
});
