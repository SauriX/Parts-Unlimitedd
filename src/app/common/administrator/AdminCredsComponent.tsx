import { Button, Col, Form, Row, Spin, Typography } from "antd";
import React, { useState } from "react";
import {
  ExclamationCircleOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import TextInput from "../form/proposal/TextInput";
import PasswordInput from "../form/proposal/PasswordInput";
import { useStore } from "../../stores/store";
import { ILoginForm } from "../../models/user";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => void;
};

const AdminCredsComponent = ({ getResult }: Props) => {
  const { profileStore } = useStore();
  const { validateAdmin } = profileStore;

  const [form] = Form.useForm<any>();

  const [loading, setLoading] = useState(false);

  const onFinish = async (creds: ILoginForm) => {
    setLoading(true);
    const isAdmin = await validateAdmin(creds);
    setLoading(false);
    getResult(isAdmin);
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24} style={{ textAlign: "center" }}>
        <ExclamationCircleOutlined style={{ color: "orange", fontSize: 48 }} />
      </Col>
      <Col span={24}>
        <Paragraph>
          Tu perfil no cuenta con los privilegios para realizar esta acción.
        </Paragraph>
        <Paragraph>Favor de ingresar los accesos administrativos.</Paragraph>
      </Col>
      <Col span={24}>
        <Spin spinning={loading}>
          <Form<ILoginForm>
            form={form}
            name="login"
            className="login-form"
            onFinish={onFinish}
          >
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
        </Spin>
      </Col>
    </Row>
  );
};

export default AdminCredsComponent;
