import { Divider } from "antd";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import RangoEdad from "./RangoEdad";
import { IParameterForm } from "../../../../app/models/parameter";
type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};
const RangoNumericoXEdad: FC<Props> = ({ idTipeVAlue, parameter }) => {
  return (
    <div>
      <Divider orientation="left"></Divider>
      <RangoEdad
        disabled={false}
        auto={false}
        idTipeVAlue={idTipeVAlue}
        parameter={parameter}
        description="Valores de referencia (Numérico por edad):"
      ></RangoEdad>
    </div>
  );
};
export default observer(RangoNumericoXEdad);
