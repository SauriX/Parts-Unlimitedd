import {
  UserOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BankOutlined,
  ShopOutlined,
  ProfileOutlined,
  BgColorsOutlined,
  PartitionOutlined,
  FolderOpenOutlined,
  DollarOutlined,
  PercentageOutlined,
  BorderOutlined,
  LikeOutlined,
  TagsOutlined,
  CarOutlined,
  ToolOutlined,
  SettingOutlined,
  LaptopOutlined,
} from "@ant-design/icons";

const IconSelector = ({ name }: { name: string }) => {
  switch (name) {
    case "role":
      return <IdcardOutlined />;
    case "user":
      return <UserOutlined />;
    case "branch":
      return <BankOutlined />;
    case "company":
      return <ShopOutlined />;
    case "medic":
      return <SafetyOutlined />;
    case "study":
      return <ProfileOutlined />;
    case "reagent":
      return <BgColorsOutlined />;
    case "indication":
      return <PartitionOutlined />;
    case "parameter":
      return <BgColorsOutlined />;
    case "catalog":
      return <FolderOpenOutlined />;
    case "price":
      return <DollarOutlined />;
    case "pack":
      return <BorderOutlined />;
    case "promo":
      return <PercentageOutlined />;
    case "loyalty":
      return <LikeOutlined />;
    case "tag":
      return <TagsOutlined />;
    case "route":
      return <CarOutlined />;
    case "maquila":
      return <ToolOutlined />;
    case "configuration":
      return <SettingOutlined />;
    case "equipment":
      return <LaptopOutlined />;
    default:
      return null;
  }
};

export default IconSelector;
