import { Button, PageHeader, Input } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

const { Search } = Input;

type LoyaltyHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const LoyaltyHeader: FC<LoyaltyHeaderProps> = ({ handlePrint }) => {
  const navigate = useNavigate();
  const { loyaltyStore } = useStore();
  const { exportList } = loyaltyStore;
  const [searchParams, setSearchParams] = useSearchParams();

  const download = () => {
    exportList(searchParams.get("search") ?? "all");
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Lealtades" image="lealtad" />}
      className="header-container"
      extra={[
        <PrintIcon key="imprimir" onClick={handlePrint} />,
        <DownloadIcon key="doc" onClick={download} />,
        <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            setSearchParams({ search: !value ? "all" : value });
            //setSearchValue(value);
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/loyalties/new");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default LoyaltyHeader;
