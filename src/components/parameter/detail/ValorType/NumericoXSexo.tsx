import { Form, Col, Button, Divider, Row } from "antd";
import { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  IParameterForm,
  ItipoValorForm,
} from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import NumberInput from "../../../../app/common/form/proposal/NumberInput";

type Props = {
  idTipeVAlue: string;
  parameter: IParameterForm;
};

type UrlParams = {
  id: string | "";
};

const RangoEdadXSexo: FC<Props> = ({ idTipeVAlue, parameter }) => {
  const [lista] = useState<any[]>([]);
  const [formValue] = Form.useForm<ItipoValorForm>();
  const [disabled, setDisabled] = useState(false);
  let { id } = useParams<UrlParams>();
  const { parameterStore } = useStore();
  const { addValue, getvalue, updatevalue, update } = parameterStore;
  const [valuesValor] = useState<ItipoValorForm[]>([]);
  
  useEffect(() => {
    const readuser = async (idUser: string) => {
      let value = await getvalue(idUser);

      formValue.setFieldsValue(value!);
      if (lista?.length > 0) {
        setDisabled(true);
      }
    };
    if (id) {
      readuser(id);
    }
  }, [formValue, getvalue, id]);

  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onFinish = async (newValues: ItipoValorForm) => {
    const value = { ...valuesValor, ...newValues };
    let success = false;
    let saveValues = false;
    if (!value.id) {
      value.nombre = idTipeVAlue;
      value.parametroId = id || "";
      saveValues = await addValue(value);
      success = await update(parameter);
    } else {
      saveValues = await updatevalue(value);
      success = await update(parameter);
    }
    if (success && saveValues) {
      navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
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
      <Form<ItipoValorForm>
        form={formValue}
        layout={"vertical"}
        style={{ marginTop: 20 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Row justify="space-between" gutter={[12, 12]}>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "hombreValorInicial",
                    label: "Valor inicial masculino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "hombreValorFinal",
                    label: "Valor final masculino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "mujerValorInicial",
                    label: "Valor inicial femenino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "mujerValorFinal",
                    label: "Valor final femenino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "hombreCriticoMinimo",
                    label: "Valor critico mínimo masculino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "hombreCriticoMaximo",
                    label: "Valor critico máximo masculino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "mujerCriticoMinimo",
                    label: "Valor critico mínimo femenino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                />
              </Col>
              <Col span={6}>
                <NumberInput
                  formProps={{
                    name: "mujerCriticoMaximo",
                    label: "Valor critico máximo femenino",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={disabled}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default observer(RangoEdadXSexo);
