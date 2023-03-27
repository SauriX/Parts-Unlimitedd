import { Form, Row, Col, Button, Divider, Input, Select } from "antd";
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
type Props = {
  description: string;
  idTipeVAlue: string;
  parameter: IParameterForm;
  auto: boolean;
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
      formValue.setFieldsValue(value!);
      if (lista.length > 0) {
        setDisable(true);
      }
    };
    if (id) {
      readuser(id);
    }
  }, [formValue, getAllvalues, id]);

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
    var validatehombre = val.map((x) => {
      if (x.valorInicialNumerico! > x.valorFinalNumerico!) {
        return true;
      }
      return false;
    });
    if (validatehombre.includes(true)) {
      alerts.warning(`En ${description} inicial no puede ser mayor al final`);
      return;
    }
    var validatehombreIgual = val.map((x) => {
      if (x.valorInicialNumerico! === x.valorFinalNumerico!) {
        return true;
      }
      return false;
    });
    if (validatehombreIgual.includes(true)) {
      alerts.warning(`En ${description} inicial no puede ser igual al final`);
      return;
    }
    var succes = await addvalues(val, id!);
    if (succes) {
      succes = await update(parameter);
      if (succes) {
        navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
      }
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
                  <Row>
                    <Col span={24}>
                      <Row justify="space-between" gutter={[12, 4]}>
                        <Col span={3}>
                          <Form.Item
                            {...valuesValor}
                            label="Rango edad inicial: "
                            name={[name, "rangoEdadInicial"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Hombre valor",
                              },
                            ]}
                          >
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder={"Rango Edad"}
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
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder="Rango Edad"
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
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder={"Valor inicial"}
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
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder="Valor final"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...valuesValor}
                            label="Valor crítrico mínimo: "
                            name={[name, "criticoMinimo"]}
                          >
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder={"Valor crítico mínimo"}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...valuesValor}
                            label="Valor crítico máximo: "
                            name={[name, "criticoMaximo"]}
                          >
                            <Input
                              type={"number"}
                              min={0}
                              max={120}
                              disabled={disable}
                              placeholder="Valor crítico máximo"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
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
