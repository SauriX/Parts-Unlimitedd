import { Form, Col, Button, Divider, Space, Input } from "antd";
import { FC, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import { toJS } from "mobx";
type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};
type UrlParams = {
  id: string | "";
};
const NumeroColumna: FC<Props> = ({ idTipeVAlue, parameter }) => {
  const [lista, setLista] = useState<any[]>([]);
  const [formValue] = Form.useForm<ItipoValorForm[]>();
  const [disabled, setDisabled] = useState(false);

  let { id } = useParams<UrlParams>();
  const { parameterStore } = useStore();
  const { addvalues, getAllvalues, update } = parameterStore;
  useEffect(() => {
    const readuser = async (idUser: string) => {
      let value = await getAllvalues(idUser, idTipeVAlue);

      value?.map((item) => lista.push(item));
      formValue.setFieldsValue(value!);
      if (lista?.length > 0) {
        setDisabled(true);
      }
    };
    if (id) {
      readuser(id);
    }
  }, [formValue, getAllvalues, id]);

  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const onFinish = async (values: any) => {
    let val: ItipoValorForm[] = values.value.map((x: ItipoValorForm) => {
      let data: ItipoValorForm = {
        nombre: idTipeVAlue,
        primeraColumna: x.primeraColumna,
        segundaColumna: x.segundaColumna,
        terceraColumna: x.terceraColumna,
        cuartaColumna: x.cuartaColumna,
        quintaColumna: x.quintaColumna,
        parametroId: id,
        id: x.id,
      };
      return data;
    });

    val = val.map((x: ItipoValorForm) => {
      if (idTipeVAlue == "6") {
        delete x.segundaColumna;
        delete x.terceraColumna;
        delete x.cuartaColumna;
        delete x.quintaColumna;
      }
      if (idTipeVAlue == "11") {
        delete x.terceraColumna;
        delete x.cuartaColumna;
        delete x.quintaColumna;
      }
      if (idTipeVAlue == "12") {
        delete x.cuartaColumna;
        delete x.quintaColumna;
      }
      if (idTipeVAlue == "13") {
        delete x.quintaColumna;
      }
      return x;
    });

    var success = await addvalues(val, id!);
    if (success) {
      success = await update(parameter);
      if (success) {
        navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
      }
    }
  };

  return (
    <div>
      <Divider orientation="left">
        Valores de referencia (Numérico por columna):
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
        name="dynamic_form_nest_item"
        style={{ marginTop: 20 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List initialValue={lista} name="value">
          {(Fields, { add, remove }) => (
            <>
              {Fields.map(({ key, name, ...valuesValor }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...valuesValor}
                    label={"Valor " + (name + 1)}
                    name={[name, "primeraColumna"]}
                    rules={[{ required: true, message: "Missing valor" }]}
                  >
                    <Input
                      type={"number"}
                      readOnly={disabled}
                      placeholder={"Valor"}
                    />
                  </Form.Item>
                  {parseInt(idTipeVAlue) === 6 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                  {parseInt(idTipeVAlue) >= 11 && (
                    <>
                      <Form.Item
                        {...valuesValor}
                        name={[name, "segundaColumna"]}
                        rules={[{ required: true, message: "Missing valor" }]}
                      >
                        <Input
                          type={"number"}
                          readOnly={disabled}
                          placeholder={"Valor"}
                        />
                      </Form.Item>
                      {parseInt(idTipeVAlue) === 11 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </>
                  )}
                  {parseInt(idTipeVAlue) >= 12 && (
                    <>
                      <Form.Item
                        {...valuesValor}
                        name={[name, "terceraColumna"]}
                        rules={[{ required: true, message: "Missing valor" }]}
                      >
                        <Input
                          type={"number"}
                          readOnly={disabled}
                          placeholder={"Valor"}
                        />
                      </Form.Item>
                      {parseInt(idTipeVAlue) === 12 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </>
                  )}
                  {parseInt(idTipeVAlue) >= 13 && (
                    <>
                      <Form.Item
                        {...valuesValor}
                        name={[name, "cuartaColumna"]}
                        rules={[{ required: true, message: "Missing valor" }]}
                      >
                        <Input
                          type={"number"}
                          readOnly={disabled}
                          placeholder={"Valor"}
                        />
                      </Form.Item>
                      {parseInt(idTipeVAlue) === 13 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </>
                  )}
                  {idTipeVAlue === "14" && (
                    <>
                      <Form.Item
                        {...valuesValor}
                        name={[name, "quintaColumna"]}
                        rules={[{ required: true, message: "Missing valor" }]}
                      >
                        <Input
                          type={"number"}
                          readOnly={disabled}
                          placeholder={"Valor"}
                        />
                      </Form.Item>
                      {parseInt(idTipeVAlue) === 14 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </>
                  )}
                </Space>
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
export default observer(NumeroColumna);
