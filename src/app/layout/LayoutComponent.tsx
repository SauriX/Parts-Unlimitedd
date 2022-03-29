import { Layout, Menu, Typography, Image, Avatar, Row, Col, Popover } from "antd";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import IconSelector from "../common/icons/IconSelector";
import { IMenu } from "../models/shared";
import { UserOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import DropdownOption from "../common/header/DropdownOption";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;

const menus: IMenu[] = [
  {
    id: 1,
    ruta: "",
    icono: "home",
    descripcion: "Inicio",
  },
  {
    id: 2,
    icono: "admin",
    descripcion: "Administración",
    subMenus: [
      { id: 3, ruta: "users", icono: "user", descripcion: "Usuarios" },
      { id: 4, ruta: "roles", icono: "role", descripcion: "Roles" },
    ],
  },
  {
    id: 5,
    ruta: "medics",
    descripcion: "Medicos",
    icono: "medico",
  },
];

const LayoutComponent = () => {
  const { profileStore } = useStore();
  const { profile } = profileStore;

  const location = useLocation();

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
                  <DropdownOption
                    option="Cerrar sesión"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                      alert("Sesión terminada");
                    }}
                  />
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
        <Sider width={200}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.substring(1)]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {menus.map((menu) =>
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
                      key={subMenu.ruta}
                      icon={<IconSelector name={subMenu.icono} />}
                    >
                      <Link to={subMenu.ruta!}>{subMenu.descripcion}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item className="menu-item" key={menu.ruta} icon={<IconSelector name={menu.icono} />}>
                  <Link to={menu.ruta!}>{menu.descripcion}</Link>
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(LayoutComponent);
