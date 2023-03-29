import { Col, Button } from "antd";
import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useStore } from "../../../../app/stores/store";
import RangoEdad from "./RangoEdad";

type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};

type UrlParams = {
  id: string | "";
};
const RangoNumericoXEdadSexo: FC<Props> = ({ idTipeVAlue, parameter }) => {
  const { parameterStore } = useStore();
  const { addvalues, update } = parameterStore;
  const [flag, setFlag] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(0);
  const [valuesList, setValuesList] = useState<ItipoValorForm[]>([]);
  const [changed, setChanged] = useState(false);
  let { id } = useParams<UrlParams>();

  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const updateValues = async () => {
      if (valuesList.length === counter && changed) {
        let success = false;
        let updateParam = false;

        success = await addvalues(valuesList, id!);

        if (success) {
          updateParam = await update(parameter);
          if (updateParam) {
            navigate(
              `/parameters?search=${searchParams.get("search") || "all"}`
            );
          }
        }
        setFlag(false);
      }
    };

    updateValues();
  }, [counter, valuesList]);

  const handle = (value: boolean) => {
    setFlag(value);
  };

  return (
    <Fragment>
      <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
        <Button
          onClick={() => {
            setDisabled(false);
          }}
          type="default"
        >
          Modificar
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            handle(true);
          }}
        >
          Guardar
        </Button>
      </Col>
      <RangoEdad
        disabled={disabled}
        auto={flag}
        idTipeVAlue={"hombre"}
        parameter={parameter}
        setCounter={setCounter}
        setValues={setValuesList}
        setFlag={setFlag}
        setChanged={setChanged}
        description="Valores de referencia Hombre (Numérico por edad y sexo):"
      ></RangoEdad>
      <RangoEdad
        disabled={disabled}
        auto={flag}
        idTipeVAlue={"mujer"}
        parameter={parameter}
        setCounter={setCounter}
        setValues={setValuesList}
        setFlag={setFlag}
        setChanged={setChanged}
        description="Valores de referencia Mujer (Numérico por edad y sexo):"
      ></RangoEdad>
    </Fragment>
  );
};
export default RangoNumericoXEdadSexo;
