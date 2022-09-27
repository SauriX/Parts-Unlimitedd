import { Form, Col, Button, Divider, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import TextArea from "antd/lib/input/TextArea";
import alerts from "../../../../app/util/alerts";
type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};
type UrlParams = {
  id: string | "";
};
const ReferenciaParrafo: FC<Props> = ({ idTipeVAlue, parameter }) => {
  const [lista, setLista] = useState<any[]>([]);
  const [formValue] = Form.useForm<ItipoValorForm[]>();
  const [disabled, setDisabled] = useState(true);
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
    console.log(values);

    const val: ItipoValorForm[] = values.value.map((x: ItipoValorForm) => {
      let data: ItipoValorForm = {
        nombre: idTipeVAlue,
        opcion: "",
        descripcionTexto: "",
        descripcionParrafo: x.descripcionParrafo,
        parametroId: id,
        id: x.id,
      };
      return data;
    });

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
      <Divider orientation="left">Valores de referencia (Párrafo):</Divider>
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
                    label={"Párrafo " + (name + 1)}
                    name={[name, "descripcionParrafo"]}
                    rules={[{ required: true, message: "Missing valor" }]}
                  >
                    <TextArea
                      disabled={disabled}
                      rows={5}
                      autoSize
                      placeholder={"Párrafo"}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
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
export default observer(ReferenciaParrafo);
