import React, { Fragment, useEffect, useState } from "react";
import { Spin, Form, Row, Col, Modal, Button } from "antd";
import { formItemLayout } from "../app/util/utils";
import { ILoginForm, IChangePasswordForm } from "../app/models/user";
import { useStore } from "../app/stores/store";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../app/common/form/proposal/TextInput";
import PasswordInput from "../app/common/form/proposal/PasswordInput";
import alerts from "../app/util/alerts";
import messages from "../app/util/messages";

const Login = () => {
  const { userStore, profileStore } = useStore();
  const { changePassordF, changePassword } = userStore;
  const { logoImg, login } = profileStore;

  const location = useLocation();

  const [form] = Form.useForm<ILoginForm>();

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) {
      alerts.info(message);
    }
  }, [location]);

  useEffect(() => {
    return () => {
      setLogging(false);
    };
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onFinish = async (creds: ILoginForm) => {
    if (!logging) {
      setLogging(true);
      await login(creds);
    } else {
      alerts.info(messages.logging);
    }
    setLogging(false);
  };

  return (
    <Fragment>
      <div className={"vertical-line"}>
        <div className={"trapecio-top"}></div>
        <div className={"trapecio-top"}></div>
        <div className={"trapecio-top"}></div>
      </div>
      <div className={"contenedor"} style={{ textAlign: "center" }}>
        <img
          src={
            logoImg ?? `${process.env.REACT_APP_CATALOG_URL}/images/logo.png`
          }
          alt="Logo"
          style={{ height: 150 }}
        />
        <h2 style={{ textAlign: "center" }}>Sistema Administrativo</h2>
      </div>
      <div className={"contenedor-formularios"}>
        <Form<ILoginForm>
          {...formItemLayout}
          form={form}
          name="login"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="center" gutter={[12, 24]}>
            <Col md={24} sm={24} xs={24}>
              <TextInput
                formProps={{
                  name: "usuario",
                  label: "",
                }}
                placeholder={"Usuario"}
                max={100}
                required
              />
            </Col>
            <Col md={24} sm={24} xs={24}>
              <PasswordInput
                formProps={{
                  name: "contraseña",
                  label: "",
                }}
                placeholder={"Contraseña"}
                max={8}
                min={8}
                required
              />
            </Col>
          </Row>
        </Form>
        <Row gutter={[12, 24]}>
          <Col
            md={16}
            sm={24}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
              loading={logging}
              style={{ backgroundColor: "#253B65", borderColor: "#253B65" }}
            >
              Ingresar
            </Button>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};
export default Login;
