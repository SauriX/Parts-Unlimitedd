import React, { Fragment, useEffect, useState } from "react";
import { Spin, Form, Row, Col,  Modal, Button, PageHeader, Divider } from "antd";
import { formItemLayout } from "../app/util/utils";
import { ILoginForm,LoginFormValues,IChangePasswordForm,ChangePasswordValues } from "../app/models/user";
import { useStore } from "../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../app/common/form/TextInput";
import PasswordInput from "../app/common/form/PasswordInput";
const Login = () => {
  const { userStore } = useStore();
  const {  loginuser,changePassordF,changePassword } = userStore;
  const [form] = Form.useForm<ILoginForm>();
  const [formPassword] = Form.useForm<IChangePasswordForm>();
  const [values, setValues] = useState<ILoginForm>(new LoginFormValues());
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formPassword.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = async (newValues: ILoginForm) => {
	  const login= {  ...newValues };
    let success = false;
    let checkPass = false;
		success = await loginuser(login);
    console.log(success);
    if (success) {
      checkPass =  await changePassordF();
      console.log("se logueo");
      console.log(checkPass );
      if(checkPass){
        console.log("hijole necesitas cmabair tu pass");
        showModal();
      }else{
        navigate(`/`);
      }
			
		} 
	};
  const onFinishPass=async(newValues:IChangePasswordForm)=>{
    let passForm ={... newValues};
    let success = false;
    let checkPass = false;
		success = await changePassword(passForm);
    console.log(success);
    if (success) {
      navigate(`/`);
    }
  }
  return (
    <Fragment>
      <div className={"vertical-line"}>
        <div className={"trapecio-top"}></div>
        <div className={"trapecio-top"}></div>
        <div className={"trapecio-top"}></div>
      </div>
      <div className={"contenedor"}>
        <img src={`/${process.env.REACT_APP_NAME}/admin/assets/logologin.png`} alt="Logo" style={{width:534}} />
      </div>
      <div className={"contenedor"}>
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
          <div>
            <Row>
              <Col md={24} sm={24} xs={24}>
                <TextInput
                  formProps={{
                    name: "userName",
                  }}
                  placeholder={"Usuario"}
                  max={100}
                  required
              />
              </Col>
              <Col md={24} sm={24} xs={24}>
                  <PasswordInput
                    formProps={{
                      name: "password",
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
              style={{backgroundColor:"#253B65",borderColor:"#253B65"}}
            >
              Ingresar
            </Button>
          </Col>
        </Row>
      </div>
      
      <Modal title="Ingreso de contraseña" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form<IChangePasswordForm>
          {...formItemLayout}
          form={formPassword}
          name="changepassword"
          onFinish={onFinishPass}
          scrollToFirstError
        >
          <Row>
            <Col md={24} sm={24} xs={24}>
              <PasswordInput
                formProps={{
                  name: "password",
                  label: "Nueva Contraseña",
                }}
                max={8}
                min={8}
                required
            />
            </Col>
            <Col md={24} sm={24} xs={24}>
                <PasswordInput
                  formProps={{
                    name: "confirmPassword",
                    label: "Confirmar Contraseña",
                  }}
                  max={8}
                  min={8}
                  required
                />
            </Col>
          </Row>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default Login;