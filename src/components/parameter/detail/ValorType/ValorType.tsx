import { FC, Fragment } from "react";
import ValorRNumerico from "./ValorRNumerico";
import RangoEdadXSexo from "./NumericoXSexo";
import RangoNumericoXEdad from "./RangoNumericoXEdad";
import RangoNumericoXEdadSexo from "./RangoNumericoXEdadSexo";
import OpcionMultiple from "./OpcionMultiple";
import ReferenciaTexto from "./ReferenciaTexto";
import ReferenciaParrafo from "./ReferenciaParrafo";
import NumericoColumna from "./NumericoColumna";
import RangoObservacion from "./RangoObservacion";
interface ValorProps {
  value: number;
  form: any;
}
const ValorType: FC<ValorProps> = ({ value, form }) => {
  function LayoutContendio(value: number) {
    switch (value) {
      case 1:
        return (
          <ValorRNumerico
            parameter={form}
            idTipeVAlue={value.toString()}
          ></ValorRNumerico>
        );
        break;
      case 2:
        return (
          <RangoEdadXSexo
            parameter={form}
            idTipeVAlue={value.toString()}
          ></RangoEdadXSexo>
        );
        break;
      case 3:
        return (
          <RangoNumericoXEdad
            parameter={form}
            idTipeVAlue={value.toString()}
          ></RangoNumericoXEdad>
        );
        break;
      case 4:
        return (
          <RangoNumericoXEdadSexo
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></RangoNumericoXEdadSexo>
        );
        break;
      case 5:
        return (
          <OpcionMultiple
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></OpcionMultiple>
        );
        break;
      case 6:
      case 11:
      case 12:
      case 13:
      case 14:
        return (
          <NumericoColumna
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></NumericoColumna>
        );
        break;
      case 7:
        return (
          <ReferenciaTexto
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></ReferenciaTexto>
        );
        break;
      case 8:
        return (
          <ReferenciaParrafo
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></ReferenciaParrafo>
        );
        break;
      case 10:
        return (
          <RangoObservacion
            parameter={form}
            idTipeVAlue={value.toLocaleString()}
          ></RangoObservacion>
        );
        break;
      default:
        return;
        break;
    }
  }
  return <Fragment>{LayoutContendio(value)}</Fragment>;
};
export default ValorType;
