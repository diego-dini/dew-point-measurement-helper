import LabeledTextInput from "elements/LabeledTextInput";
import { useEffect, useState } from "react";
import { View } from "react-native";

/**
 * Função para atualizar o valor de uma torre.
 * @param newValue Novo valor numérico para a torre
 */
type SetTower = (newValue: number) => void;

/**
 * Props do componente TowersContainer
 * - leftTower: valor da torre esquerda
 * - rigthTower: valor da torre direita
 * - setLeftTower: setter para torre esquerda
 * - setRigthTower: setter para torre direita
 */
type TowersContainerProps = {
  leftTower: number;
  rigthTower: number;
  setLeftTower: SetTower;
  setRigthTower: SetTower;
};

/**
 * Componente para entrada de valores das torres esquerda e direita.
 * Formata e controla valores decimais, aceita negativos e atualiza o estado externo.
 */
export default function TowersContainer(props: TowersContainerProps) {
  const { leftTower, rigthTower, setLeftTower, setRigthTower } = props;
  const [leftDisplayValue, setleftDisplayValue] = useState<string>(
    String(leftTower)
  );
  const [rightDisplayValue, setrightDisplayValue] = useState<string>(
    String(rigthTower)
  );

  useEffect(() => {
    setleftDisplayValue(leftTower.toFixed(2).replace(".", ","));
    setrightDisplayValue(rigthTower.toFixed(2).replace(".", ","));
  }, [leftTower, rigthTower]);

  /**
   * Atualiza valor da torre ao digitar, formatando para decimal brasileiro.
   * @param tower "left" ou "rigth"
   * @param value Valor digitado
   */
  const onValueChange = (tower: "left" | "rigth", value: string) => {
    const str = value.replace(/\D/g, "").replace(/^0+/, "");
    let newValue = "";
    if (value.includes("-")) newValue = "-";
    if (str.length <= 2) newValue += "0," + str.padStart(2, "0");
    else newValue += str.slice(0, -2) + "," + str.slice(-2);
    if (Number(str) == 0) newValue = "0";
    switch (tower) {
      case "left":
        setLeftTower(Number(newValue.replace(",", ".")));
        break;
      case "rigth":
        setRigthTower(Number(newValue.replace(",", ".")));
        break;
    }
  };

  /**
   * Ao sair do campo, garante que o valor seja convertido corretamente para número.
   * @param setTower Função setter da torre
   * @param text Valor exibido no input
   */
  const setTowerValue = (setTower: SetTower, text: string) => {
    let newNum = 0;
    let isNegative = false;
    if (text[0] === "-") isNegative = true;
    newNum = Number(text.replaceAll("-", "").replaceAll(",", "."));
    if (isNaN(newNum)) return setTower(0);
    newNum *= isNegative ? -1 : 1;
    setTower(newNum);
  };

  return (
    <View>
      <LabeledTextInput
        keyboardType="number-pad"
        labelStyle={{ width: "20%" }}
        labelValue="Direita"
        onBlur={() => setTowerValue(setLeftTower, leftDisplayValue)}
        onChange={(e) => onValueChange("left", e.nativeEvent.text)}
        value={leftDisplayValue}
      />
      <LabeledTextInput
        keyboardType="number-pad"
        labelStyle={{ width: "20%" }}
        labelValue="Esquerda"
        onBlur={() => setTowerValue(setRigthTower, rightDisplayValue)}
        onChange={(e) => onValueChange("rigth", e.nativeEvent.text)}
        value={rightDisplayValue}
      />
    </View>
  );
}
