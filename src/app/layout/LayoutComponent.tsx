import "./css/drawerThemeColor.less";
import {
  Layout,
  Menu,
  Typography,
  Image,
  Avatar,
  Row,
  Col,
  Popover,
  Form,
  Spin,
  Button,
  Tooltip,
  List,
  Divider,
  Badge,
  Card,
} from "antd";
import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import IconSelector from "../common/icons/IconSelector";
import { IMenu, IOptions } from "../models/shared";
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SettingOutlined,
  BgColorsOutlined,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import DropdownOption from "../common/header/DropdownOption";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { IChangePasswordForm } from "../models/user";
import { formItemLayout, shortCuts } from "../util/utils";
import PasswordInput from "../common/form/PasswordInput";
import HeaderTitle from "../common/header/HeaderTitle";
import Notifications from "./Notifications";
import Configuration from "../../components/configuration/Configuration";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getMenuIcon from "../common/icons/menuIcon";
import SelectInput from "../common/form/proposal/SelectInput";
import { useForm } from "antd/es/form/Form";
const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

interface IItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: IItem[];
}

const LayoutComponent = () => {
  const {
    profileStore,
    drawerStore,
    modalStore,
    notificationStore,
    optionStore,
    userStore,
  } = useStore();
  const { updateBranch } = userStore;
  const { getBranchCityOptions, branchCityOptions } = optionStore;
  const { openDrawer } = drawerStore;
  const { openModal } = modalStore;
  const { createHubConnection } = notificationStore;
  const { profile, menu, logoImg, isLoggedIn, logout, getProfile, getMenu } =
    profileStore;

  const { switcher } = useThemeSwitcher();
  const location = useLocation();
  const [form] = useForm();

  const [collapsed, setCollapsed] = useState(true);
  const [branchCityFiltered, setBranchCityFiltered] = useState<any>();
  const [menus, setMenus] = useState<IItem[]>([]);

  const convertMenu = useCallback(
    (menus: IMenu[]): IItem[] => {
      return menus.map((x) => ({
        key: uuid(),
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
        icon: <FontAwesomeIcon icon={getMenuIcon(x.icono)} />,
        children:
          !!x.subMenus && x.subMenus.length > 0
            ? convertMenu(x.subMenus)
            : undefined,
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
      openModal({
        title: "Configuración de contraseña",
        body: <SetPasswordComponent />,
        closable: false,
      });
    }
  }, [openModal, profile]);

  useEffect(() => {
    if (isLoggedIn) {
      createHubConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getBranchCityOptions();
  }, []);
  useEffect(() => {
    if (profile) {
      form.setFieldValue("sucursal", profile.sucursal);
    }
  }, [profile]);
  useEffect(() => {
    const branchesFiltered: IOptions[] = [];
    branchCityOptions.forEach((bco) => {
      let sucursalesDisponibles = bco.options?.filter((x) =>
        profile?.sucursales.includes("" + x.value)
      );
      if (!!sucursalesDisponibles?.length) {
        let copy = {
          ...bco,
          options: sucursalesDisponibles,
        };
        branchesFiltered.push(copy);
      }
    });
    setBranchCityFiltered(branchesFiltered);
  }, [branchCityOptions]);
  const updateUserBranch = async (changedValues: any) => {
    await updateBranch(changedValues.sucursal);
    await getProfile();
  };

  const openNotifications = () => {
    openDrawer({
      title: (
        <HeaderTitle
          title="Notificaciones"
          icon={<NotificationOutlined className="header-title-icon" />}
        />
      ),
      body: <Notifications />,
    });
  };

  const selectTheme = (theme: "dark" | "light" | "yellow") => {
    switcher({
      theme: theme,
    });
  };
  const navigate = useNavigate();

  const renderShortCuts = () => {
    return (
      <Fragment>
        <List
          header={
            <Title level={5} className="title-shortcut">
              ATAJOS DEL TECLADO
            </Title>
          }
          bordered={false}
          dataSource={shortCuts}
          renderItem={(item) => (
            <List.Item>
              <Row>
                <Col span={24}>
                  <Badge.Ribbon
                    text={item.shortCut}
                    placement="start"
                    className="badge-shortcut"
                  >
                    <Card title="  " className="shortcut-card">
                      {item.description}
                    </Card>
                  </Badge.Ribbon>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Fragment>
    );
  };

  return (
    <Layout id="app-layout">
      <Header className="header">
        <Row>
          <Col span={15}>
            <div
              className="header-logo-container"
              onClick={() => {
                navigate(`/`);
              }}
            >
              <Image
                src={
                  logoImg ??
                  `${process.env.REACT_APP_CATALOG_URL}/images/logo.png`
                }
                preview={false}
              />
            </div>
          </Col>
          <Col span={3} className="header-data" style={{ paddingTop: 20 }}>
            <Form form={form} onValuesChange={updateUserBranch}>
              <SelectInput
                formProps={{ label: "Sucursal", name: "sucursal" }}
                options={branchCityFiltered}
              />
            </Form>
          </Col>
          <Col span={6} className="header-data" style={{ textAlign: "right" }}>
            <Avatar icon={<UserOutlined />} />
            <Text>{profile?.nombre}</Text>

            <Tooltip placement="bottomRight" title={renderShortCuts}>
              <QuestionCircleTwoTone />
            </Tooltip>
            <NotificationOutlined
              className="trigger"
              onClick={openNotifications}
            />
            <Popover
              placement="topLeft"
              content={
                <Row style={{ width: 100 }}>
                  <DropdownOption
                    option="Claro"
                    onClick={() => selectTheme("light")}
                  />
                  <DropdownOption
                    option="Oscuro"
                    onClick={() => selectTheme("dark")}
                  />
                  <DropdownOption
                    option="Atardecer"
                    onClick={() => selectTheme("yellow")}
                  />
                </Row>
              }
              trigger="click"
            >
              <BgColorsOutlined style={{ marginRight: 20 }} />
            </Popover>
            <Popover
              placement="topLeft"
              content={
                <Row style={{ width: 150 }}>
                  <DropdownOption
                    option="Cerrar sesión"
                    icon={<LogoutOutlined />}
                    onClick={logout}
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
        <Sider
          collapsible
          className="side-container"
          width={250}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            className="menu-contrast-custom-theme"
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
