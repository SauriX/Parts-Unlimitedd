import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  IdcardOutlined,
  SafetyOutlined,
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
    default:
      return null;
  }
};

export default IconSelector;
