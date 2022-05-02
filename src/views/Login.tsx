import React, { Fragment, useEffect, useState } from "react";
import { Spin, Form, Row, Col, Modal, Button } from "antd";
import { formItemLayout } from "../app/util/utils";
import { ILoginForm, IChangePasswordForm } from "../app/models/user";
import { useStore } from "../app/stores/store";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../app/common/form/TextInput";
import PasswordInput from "../app/common/form/PasswordInput";
import alerts from "../app/util/alerts";
import messages from "../app/util/messages";

const Login = () => {
  const { userStore, profileStore } = useStore();
  const { changePassordF, changePassword } = userStore;
  const { login } = profileStore;

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
      <div className={"contenedor"}>
        <img
          src={`/${process.env.REACT_APP_NAME}/admin/assets/logologin.png`}
          alt="Logo"
          style={{ width: 534 }}
        />
      </div>
      <div className={"contenedor"}>
        <h2 style={{ textAlign: "center" }}>Sistema Administrativo</h2>
      </div>
      <div className={"contenedor-formularios"}>
        {/* <Spin spinning={logging}> */}
        <Form<ILoginForm> {...formItemLayout} form={form} name="login" onFinish={onFinish} scrollToFirstError>
          <div>
            <Row>
              <Col md={24} sm={24} xs={24}>
                <TextInput
                  formProps={{
                    name: "usuario",
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
                  }}
                  placeholder={"Contraseña"}
                  max={8}
                  min={8}
                  required
                />
              </Col>
            </Row>
          </div>
        </Form>
        <Row style={{ marginBottom: 24, marginLeft: 50 }}>
          <Col md={12} sm={24} style={{ textAlign: "center" }}>
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
        {/* </Spin> */}
      </div>
    </Fragment>
  );
};
export default Login;
