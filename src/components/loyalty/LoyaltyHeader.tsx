import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

const { Search } = Input;

type LoyaltyHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  // loyalty: ILoyaltyForm[];
  // setFilteredContacts: React.Dispatch<React.SetStateAction<ILoyaltyForm[]>>;
};

const LoyaltyHeader: FC<LoyaltyHeaderProps> = ({
  handlePrint,
  // , loyalty,
  // setFilteredContacts,
}) => {
  const navigate = useNavigate();
  const { loyaltyStore } = useStore();
  const { exportList } = loyaltyStore;
  const [searchParams, setSearchParams] = useSearchParams();
  // const [searchValue, setSearchValue] = useState<string>("");

  //console.log("Header");

  const download = () => {
    exportList(searchParams.get("search") ?? "all");
  };

  // useEffect(() => {
  //   setFilteredContacts(
  //     loyalty.filter(
  //       (x) =>
  //         x.clave.toString()?.includes(searchValue.toLowerCase()) ||
  //         x.nombre.toLowerCase().includes(searchValue.toLowerCase())

  //     )
  //   );
  // }, [loyalty, searchValue, setFilteredContacts]);

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
