import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Spin } from "antd";
import TextInput from "../../app/common/form/TextInput";
import SwitchInput from "../../app/common/form/SwitchInput";
import { observer } from "mobx-react-lite";
import PasswordInput from "../../app/common/form/PasswordInput";
import { IConfigurationEmail } from "../../app/models/configuration";
import { useStore } from "../../app/stores/store";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const ConfigurationEmailForm = () => {
  const { configurationStore } = useStore();
  const { scopes, getEmail, updateEmail } = configurationStore;

  const [form] = Form.useForm<IConfigurationEmail>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(true);

  useEffect(() => {
    const readEmail = async () => {
      setLoading(true);
      const email = await getEmail();
      if (email) {
        form.setFieldsValue(email);
      }
      setLoading(false);
    };

    readEmail();
  }, [form, getEmail]);

  useEffect(() => {
    if (scopes?.modificar) {
      setReadonly(false);
    }
  }, [scopes]);

  const onFinish = async (email: IConfigurationEmail) => {
    setLoading(true);
    await updateEmail(email);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<IConfigurationEmail>
        {...formItemLayout}
        form={form}
        name="email"
        onFinish={onFinish}
        scrollToFirstError
      >
        <TextInput
          formProps={{ name: "correo", label: "Correo" }}
          max={4000}
          required
          readonly={readonly}
          type="email"
        />
        <TextInput
          formProps={{ name: "remitente", label: "Remitente" }}
          max={4000}
          required
          readonly={readonly}
        />
        <TextInput formProps={{ name: "smtp", label: "SMTP" }} max={4000} required readonly={readonly} />
        <SwitchInput name="requiereContraseña" label="Requiere contraseña" readonly={readonly} />
        <PasswordInput
          formProps={{
            name: "contraseña",
            label: "Contraseña",
            tooltip: "La contraseña no se muestra, solo es requerida si se desea actualizar",
          }}
          max={4000}
          readonly={readonly}
        />
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            {!readonly && (
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(ConfigurationEmailForm);
