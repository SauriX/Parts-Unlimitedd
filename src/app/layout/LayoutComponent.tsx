import { Layout, Menu, Typography, Image, Avatar, Row, Col, Popover, Tooltip, Modal, Form } from "antd";
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import IconSelector from "../common/icons/IconSelector";
import { IMenu } from "../models/shared";
import { UserOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import DropdownOption from "../common/header/DropdownOption";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { IChangePasswordForm } from "../models/user";
import { formItemLayout } from "../util/utils";
import PasswordInput from "../common/form/PasswordInput";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;

const LayoutComponent = () => {
  const { profileStore, userStore } = useStore();
  const { profile, menu, logout, setProfile, getProfile, getMenu } = profileStore;
  const { changePassword } = userStore;

  let navigate = useNavigate();
  const location = useLocation();

  const [formPassword] = Form.useForm<IChangePasswordForm>();

  useEffect(() => {
    const readUsers = async () => {
      await getMenu();
      await getProfile();
    };
    readUsers();
  }, [getMenu, getProfile]);

  const handleOk = () => {
    formPassword.submit();
  };

  const onFinishPass = async (newValues: IChangePasswordForm) => {
    let passForm = { ...newValues };
    let success = false;
    let checkPass = false;
    await changePassword(passForm);
    setProfile({ ...profile!, requiereCambio: false });
    // console.log(success);
  };

  return (
    <Layout id="app-layout">
      <Header className="header">
        <Row>
          <Col span={12}>
            <div className="header-logo-container">
              <Image src={`/${process.env.REACT_APP_NAME}/admin/assets/logo.png`} preview={false} />
            </div>
          </Col>
          <Col span={12} className="header-data" style={{ textAlign: "right" }}>
            <Avatar icon={<UserOutlined />} />
            <Text>{profile?.nombre}</Text>
            <Popover
              placement="topLeft"
              content={
                <Row style={{ width: 150 }}>
                  <DropdownOption option="Cerrar sesión" icon={<LogoutOutlined />} onClick={logout} />
                </Row>
              }
              trigger="click"
            >
              <DownOutlined style={{ marginRight: 20 }} />
            </Popover>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider width={250}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.substring(1)]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {menu.map((menu) =>
              menu.subMenus && menu.subMenus.length > 0 ? (
                <SubMenu
                  className="menu-item"
                  key={menu.id}
                  icon={<IconSelector name={menu.icono} />}
                  title={menu.descripcion}
                >
                  {menu.subMenus.map((subMenu) => (
                    <Menu.Item
                      className="menu-item"
                      key={subMenu.ruta ?? subMenu.descripcion}
                      icon={<IconSelector name={subMenu.icono} />}
                    >
                      <Link to={subMenu.ruta ?? subMenu.descripcion}>{subMenu.descripcion}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  className="menu-item"
                  key={menu.ruta ?? menu.descripcion}
                  icon={<IconSelector name={menu.icono} />}
                >
                  <Link to={menu.ruta ?? menu.descripcion}>{menu.descripcion}</Link>
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>
        <Layout id="content-layout">
          <Content
            className="site-layout-background"
            style={{
              padding: "12px 24px",
              margin: 12,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Modal
              title="Ingreso de contraseña"
              visible={profile && profile.requiereCambio}
              onOk={handleOk}
              closable={false}
              cancelButtonProps={{ style: { display: "none" } }}
            >
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
                        name: "contraseña",
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
                        name: "confirmaContraseña",
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(LayoutComponent);
