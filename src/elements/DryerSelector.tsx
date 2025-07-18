import { useEffect, useState } from "react";
import { View, ViewProps } from "react-native";
import { Dryer } from "types/dryer";
import storage from "utils/storage";
import DryerButton from "./DryerButton";

/**
 * Props para o componente DryerSelector.
 */
type DryerSelectorProps = {
  setDryer(dryer: Dryer): void;
};

/**
 * Componente que exibe lista de desumidificadores disponíveis.
 * Carrega desumidificadores do storage e renderiza botões para seleção.
 * @param setDryer Função chamada quando um desumidificador é selecionado
 */
export default function DryerSelector(props: DryerSelectorProps & ViewProps) {
  const { setDryer, ...viewProps } = props;
  const [dryers, setDryers] = useState<Dryer[]>([]);

  useEffect(() => {
    storage.getDryers().then(setDryers);
  }, []);

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
      {...viewProps}
    >
      {dryers.map((dryer, idx) => (
        <DryerButton
          setDryer={setDryer}
          dryer={dryer}
          key={idx}
          style={{ marginBottom: 8 }}
        >
          {dryer.name}
        </DryerButton>
      ))}
    </View>
  );
}
