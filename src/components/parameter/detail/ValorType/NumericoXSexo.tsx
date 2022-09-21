import { Form, Col, Button, Divider, Input, Space, Row } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import { observer } from "mobx-react-lite";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";

type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};

type UrlParams = {
  id: string | "";
};

const RangoEdadXSexo: FC<Props> = ({ idTipeVAlue, parameter }) => {
  const [lista, setLista] = useState<any[]>([]);
  const [formValue] = Form.useForm<ItipoValorForm[]>();
  const [disabled, setDisabled] = useState(false);
  let { id } = useParams<UrlParams>();
  const { parameterStore } = useStore();
  const { addvalues, getAllvalues, update } = parameterStore;
  const [valuesValor, setValuesValor] = useState<ItipoValorForm[]>([]);
  useEffect(() => {
    const readuser = async (idUser: string) => {
      let value = await getAllvalues(idUser, idTipeVAlue);
      console.log("form");
      console.log(value);

      value?.map((item) => lista.push(item));
      //setLista(prev=>[...prev,...value!]);
      formValue.setFieldsValue(value!);
      if (lista?.length > 0) {
        setDisabled(true);
      }
    };
    if (id) {
      readuser(id);
    }
  }, [formValue, getAllvalues, id]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const onFinish = async (values: any) => {
    console.log(values);

    const val: ItipoValorForm[] = values.value.map((x: ItipoValorForm) => {
      let data: ItipoValorForm = {
        hombreValorInicial: x.hombreValorInicial,
        hombreValorFinal: x.hombreValorFinal,
        mujerValorInicial: x.mujerValorInicial,
        mujerValorFinal: x.mujerValorFinal,
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
      console.log(x, "x");
      if (x.hombreValorInicial! > x.hombreValorFinal!) {
        console.log("if");
        return true;
      }
      return false;
    });
    if (validatehombre.includes(true)) {
      alerts.warning("El valor hombre inicial no puede ser mayor al final");
      return;
    }
    var validatehombreIgual = val.map((x) => {
      console.log(x, "x");
      if (x.hombreValorInicial! === x.hombreValorFinal!) {
        console.log("if");
        return true;
      }
      return false;
    });
    if (validatehombreIgual.includes(true)) {
      alerts.warning("El valor hombre inicial no puede ser igual al final");
      return;
    }

    var validatehombre = val.map((x) => {
      console.log(x, "x");
      if (x.mujerValorInicial! > x.mujerValorFinal!) {
        console.log("if");
        return true;
      }
      return false;
    });
    if (validatehombre.includes(true)) {
      alerts.warning("El valor mujer inicial no puede ser mayor al final");
      return;
    }
    var validatehombreIgual = val.map((x) => {
      console.log(x, "x");
      if (x.mujerValorInicial! === x.mujerValorFinal!) {
        console.log("if");
        return true;
      }
      return false;
    });
    if (validatehombreIgual.includes(true)) {
      alerts.warning("El valor mujer inicial no puede ser igual al final");
      return;
    }
    if (parameter.formula != "") {
      var succes = await addvalues(val, id!);
      if (succes) {
        succes = await update(parameter);
        if (succes) {
          navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
        }
      }
    } else {
      alerts.warning("Necesita ingresar una formula");
    }
  };

  return (
    <div>
      <Divider orientation="left">
        Valores de referencia (Numérico por sexo):
      </Divider>

      <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
        {disabled && (
          <Button
            onClick={() => {
              setDisabled(false);
            }}
            type="default"
          >
            Modificar
          </Button>
        )}
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
      <Form<any[]>
        form={formValue}
        layout={"vertical"}
        name="dynamic_form_nest_item"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List initialValue={lista} name="value">
          {(Fields, { add, remove }) => (
            <>
              {Fields.map(({ key, name, ...valuesValor }) => (
                <>
                  <Row>
                    <Col span={22}>
                      <Row justify="space-between" gutter={[12, 4]}>
                        <Col span={6}>
                          <Form.Item
                            label="Valor inicial hombre: "
                            {...valuesValor}
                            name={[name, "hombreValorInicial"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Hombre valor",
                              },
                            ]}
                          >
                            <Input
                              type={"number"}
                              disabled={disabled}
                              min={0}
                              placeholder={"Hombre valor"}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Valor final hombre: "
                            {...valuesValor}
                            name={[name, "hombreValorFinal"]}
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
                              disabled={disabled}
                              placeholder="Hombre valor"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Valor inicial mujer: "
                            {...valuesValor}
                            name={[name, "mujerValorInicial"]}
                            rules={[{ required: true, message: "Mujer valor" }]}
                          >
                            <Input
                              type={"number"}
                              min={0}
                              disabled={disabled}
                              placeholder={"Mujer valor"}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Valor inicial mujer: "
                            {...valuesValor}
                            name={[name, "mujerValorFinal"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Mujer valor",
                              },
                            ]}
                          >
                            <Input
                              type={"number"}
                              min={0}
                              disabled={disabled}
                              placeholder="Mujer valor"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                  </Row>
                </>
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
export default observer(RangoEdadXSexo);
