import { Button, Col, Form, Row, Typography } from "antd";
import React from "react";
import { ExclamationCircleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import TextInput from "../form/proposal/TextInput";
import PasswordInput from "../form/proposal/PasswordInput";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => void;
};

const AdminCredsComponent = ({ getResult }: Props) => {
  const [form] = Form.useForm<any>();

  const onFinish = () => {};

  return (
    <Row gutter={[12, 12]}>
      <Col span={24} style={{ textAlign: "center" }}>
        <ExclamationCircleOutlined style={{ color: "orange", fontSize: 48 }} />
      </Col>
      <Col span={24}>
        <Paragraph>Tu perfil no cuenta con los privilegios para realizar esta acción.</Paragraph>
        <Paragraph>Favor de ingresar los accesos administrativos.</Paragraph>
      </Col>
      <Col span={24}>
        <Form<any> form={form} name="login" className="login-form" onFinish={onFinish}>
          <Row gutter={[12, 12]}>
            <Col md={12} xs={24}>
              <TextInput
                formProps={{ name: "usuario" }}
                required
                max={200}
                placeholder="Usuario"
                prefix={<UserOutlined />}
              />
            </Col>
            <Col md={12} xs={24}>
              <PasswordInput
                formProps={{ name: "contraseña" }}
                required
                placeholder="Contraseña"
                prefix={<LockOutlined />}
              />
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Confirmar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default AdminCredsComponent;
