import { Form, Row, Col, Button, Divider, Select, InputNumber } from "antd";
import { FC, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { toJS } from "mobx";
type Props = {
  description: string;
  idTipeVAlue: string;
  parameter: IParameterForm;
  auto: boolean;
  setValues?: React.Dispatch<React.SetStateAction<ItipoValorForm[]>>;
  setCounter?: React.Dispatch<React.SetStateAction<number>>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  setChanged?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
};
type UrlParams = {
  id: string | "";
};
const RangoEdad: FC<Props> = ({
  description,
  idTipeVAlue,
  parameter,
  auto,
  setFlag,
  setCounter,
  setValues,
  setChanged,
  disabled,
}) => {
  const [lista] = useState<any[]>([]);
  const [formValue] = Form.useForm<ItipoValorForm[]>();
  const [disable, setDisable] = useState(disabled);
  let { id } = useParams<UrlParams>();
  const { parameterStore } = useStore();
  const { addvalues, getAllvalues, update } = parameterStore;

  useEffect(() => {
    const update = () => {
      formValue.submit();
    };
    if (idTipeVAlue == "hombre" || idTipeVAlue == "mujer") {
      if (auto) {
        update();
      }
    }
  }, [auto]);

  useEffect(() => {
    setDisable(disabled);
  }, [disabled]);

  useEffect(() => {
    const readuser = async (idUser: string) => {
      let value = await getAllvalues(idUser, idTipeVAlue);

      value?.map((item) => lista.push(item));
      if (setCounter) setCounter((counter) => counter + lista.length);
      formValue.setFieldsValue(value!);
      if (lista.length > 0) {
        setDisable(true);
      }
    };
    if (id) {
      readuser(id);
    }
  }, [formValue, id]);

  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onFinish = async (values: any) => {
    const val: ItipoValorForm[] = values.value.map((x: ItipoValorForm) => {
      let data: ItipoValorForm = {
        valorInicialNumerico: x.valorInicialNumerico,
        valorFinalNumerico: x.valorFinalNumerico,
        criticoMinimo: x.criticoMinimo,
        criticoMaximo: x.criticoMaximo,
        rangoEdadInicial: x.rangoEdadInicial,
        rangoEdadFinal: x.rangoEdadFinal,
        medidaTiempoId: x.medidaTiempoId,
        nombre: idTipeVAlue,
        opcion: "",
        descripcionTexto: "",
        descripcionParrafo: "",
        parametroId: id,
        id: x.id,
      };
      return data;
    });

    let validate = val.map((x) => {
      if (x.valorInicialNumerico! > x.valorFinalNumerico!) {
        return true;
      }
      return false;
    });

    if (validate.includes(true)) {
      alerts.warning(`En ${description} inicial no puede ser mayor al final`);
      return;
    }

    let validateEquality = val.map((x) => {
      if (x.valorInicialNumerico! === x.valorFinalNumerico!) {
        return true;
      }
      return false;
    });

    if (validateEquality.includes(true)) {
      alerts.warning(`En ${description} inicial no puede ser igual al final`);
      return;
    }

    if ((val && idTipeVAlue === "hombre") || idTipeVAlue === "mujer") {
      setValues!((values) => [...values, ...val]);
    }

    if (idTipeVAlue !== "hombre" && idTipeVAlue !== "mujer") {
      let success = false;
      let updateParam = false;
      if (val) {
        success = await addvalues(val, id!);
      } else return;

      if (success) {
        updateParam = await update(parameter);
        if (updateParam) {
          navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
        }
      }
      setFlag!(false);
    }
  };
  const onValuesChange = async (changeValues: any, values: any) => {
    const fields = Object.keys(changeValues)[0];
    if (fields === "rangoEdadInicial") {
      const value = changeValues[fields];
      if (value < formValue.getFieldValue("rangoEdadFinal")) {
        alerts.warning("El rango final no puede ser menor al inicial");
      }
    }
  };
  return (
    <div>
      <Divider orientation="left">{description}</Divider>
      {idTipeVAlue != "hombre" && idTipeVAlue != "mujer" && (
        <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
          <Button
            onClick={() => {
              setDisable(false);
            }}
            type="default"
          >
            Modificar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              formValue.submit();
            }}
          >
            Guardar
          </Button>
        </Col>
      )}
      <Form<any[]>
        form={formValue}
        layout={"vertical"}
        name="dynamic_form_nest_item"
        style={{ marginTop: 20 }}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List initialValue={lista} name="value">
          {(Fields, { add, remove }) => (
            <>
              {Fields.map(({ key, name, ...valuesValor }) => (
                <div>
                  <Row justify="space-between" gutter={[12, 4]}>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Rango edad inicial: "
                        name={[name, "rangoEdadInicial"]}
                        rules={[
                          {
                            required: true,
                            message: "Valor faltante",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder={"Rango Edad"}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Rango edad final: "
                        name={[name, "rangoEdadFinal"]}
                        rules={[
                          {
                            required: true,
                            message: "Rango de edad faltante",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder="Rango Edad"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Unidad de tiempo: "
                        name={[name, "medidaTiempoId"]}
                        rules={[
                          {
                            required: true,
                            message: "Unidad de medida faltante",
                          },
                        ]}
                      >
                        <Select
                          defaultValue={0}
                          disabled={disable}
                          options={[
                            { label: "Unidad de tiempo", value: 0 },
                            { label: "Días", value: 1 },
                            { label: "Meses", value: 2 },
                            { label: "Años", value: 3 },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Valor númerico inicial: "
                        name={[name, "valorInicialNumerico"]}
                        rules={[
                          {
                            required: true,
                            message: "Valor inicial faltante",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder={"Valor inicial"}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Valor númerico final: "
                        name={[name, "valorFinalNumerico"]}
                        rules={[
                          {
                            required: true,
                            message: "Valor final faltante",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder="Valor final"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Valor crítrico mínimo: "
                        name={[name, "criticoMinimo"]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder={"Valor crítico mínimo"}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...valuesValor}
                        label="Valor crítico máximo: "
                        name={[name, "criticoMaximo"]}
                      >
                        <InputNumber
                          min={0}
                          max={120}
                          disabled={disable}
                          placeholder="Valor crítico máximo"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          if (setCounter && setChanged) {
                            setCounter((counter) => counter - 1);
                            setChanged!(true);
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    if (setCounter && setChanged) {
                      setCounter!((counter) => counter + 1);
                      setChanged!(true);
                    }
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar campo
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
};
export default observer(RangoEdad);
