import { Layout, Menu, Typography, Image, Avatar, Row, Col, Popover, Form, Spin, Button } from "antd";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import IconSelector from "../common/icons/IconSelector";
import { IMenu } from "../models/shared";
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import DropdownOption from "../common/header/DropdownOption";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { IChangePasswordForm } from "../models/user";
import { formItemLayout } from "../util/utils";
import PasswordInput from "../common/form/PasswordInput";
import HeaderTitle from "../common/header/HeaderTitle";
import Notifications from "./Notifications";
import Configuration from "../../components/configuration/Configuration";
const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface IItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: IItem[];
}

const LayoutComponent = () => {
  const { profileStore, drawerStore, modalStore } = useStore();
  const { openDrawer } = drawerStore;
  const { openModal } = modalStore;
  const { profile, menu, logoImg, logout, getProfile, getMenu } = profileStore;

  const location = useLocation();

  const [menus, setMenus] = useState<IItem[]>([]);

  const convertMenu = useCallback(
    (menus: IMenu[]): IItem[] => {
      return menus.map((x) => ({
        key: x.id.toString() + "-" + x.ruta ?? x.descripcion,
        label:
          x.subMenus && x.subMenus.length > 0 ? (
            x.descripcion
          ) : x.ruta === "configuration" ? (
            <Link
              to="#"
              onClick={() =>
                openDrawer({
                  title: (
                    <HeaderTitle
                      title="Configuración de parámetros del sistema"
                      icon={<SettingOutlined className="header-title-icon" />}
                    />
                  ),
                  body: <Configuration />,
                  width: 550,
                })
              }
            >
              {x.descripcion}
            </Link>
          ) : (
            <Link to={x.ruta ?? x.descripcion}>{x.descripcion}</Link>
          ),
        icon: <IconSelector name={x.icono} />,
        children: !!x.subMenus && x.subMenus.length > 0 ? convertMenu(x.subMenus) : undefined,
      }));
    },
    [openDrawer]
  );

  useEffect(() => {
    const items = convertMenu(menu);
    setMenus(items);
  }, [convertMenu, menu]);

  useEffect(() => {
    const readUsers = async () => {
      await getMenu();
      await getProfile();
    };
    readUsers();
  }, [getMenu, getProfile]);

  useEffect(() => {
    if (profile && profile.requiereCambio) {
      openModal({ title: "Configuración de contraseña", body: <SetPasswordComponent />, closable: false });
    }
  }, [openModal, profile]);

  const openNotifications = () => {
    openDrawer({
      title: (
        <HeaderTitle title="Notificaciones" icon={<NotificationOutlined className="header-title-icon" />} />
      ),
      body: <Notifications />,
    });
  };

  return (
    <Layout id="app-layout">
      <Header className="header">
        <Row>
          <Col span={12}>
            <div className="header-logo-container">
              <Image
                src={logoImg ?? `${process.env.REACT_APP_CATALOG_URL}/images/logo.png`}
                preview={false}
              />
            </div>
          </Col>
          <Col span={12} className="header-data" style={{ textAlign: "right" }}>
            <Avatar icon={<UserOutlined />} />
            <Text>{profile?.nombre}</Text>
            <NotificationOutlined className="trigger" onClick={openNotifications} />
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
            className="layout-menu"
            selectedKeys={[location.pathname.substring(1)]}
            style={{ height: "100%", borderRight: 0 }}
            items={menus}
          ></Menu>
        </Sider>
        <Layout id="content-layout">
          <Content className="site-layout-background content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(LayoutComponent);

const SetPasswordComponent = observer(() => {
  const { modalStore, profileStore, userStore } = useStore();
  const { closeModal } = modalStore;
  const { profile, setProfile } = profileStore;
  const { changePassword } = userStore;

  const [form] = Form.useForm<IChangePasswordForm>();

  const [loading, setLoading] = useState(false);

  const onFinish = async (newValues: IChangePasswordForm) => {
    setLoading(true);
    let passForm = { ...newValues };
    let success = await changePassword(passForm);
    setLoading(false);
    if (success) {
      setProfile({ ...profile!, requiereCambio: false });
      closeModal();
    }
  };

  return (
    <Spin spinning={loading}>
      <Form<IChangePasswordForm>
        {...formItemLayout}
        form={form}
        name="changepassword"
        onFinish={onFinish}
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
          <Col md={24} sm={24} xs={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
});
