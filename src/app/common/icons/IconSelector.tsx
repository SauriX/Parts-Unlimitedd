import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BankOutlined
} from "@ant-design/icons";

const IconSelector = ({ name }: { name: string }) => {
  switch (name) {
    case "home":
      return <HomeOutlined />;
    case "admin":
      return <SettingOutlined />;
    case "user":
      return <UserOutlined />;
    case "role":
      return <IdcardOutlined />;
    case "medico":
      return <SafetyOutlined />;
    case "laboratorio":
      return <BankOutlined />;
    default:
      return null;
  }
};

export default IconSelector;
