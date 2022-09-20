import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

const { Search } = Input;
type UserHeaderProps = {
  handlePrint: () => void;
  handleList: () => void;
};
const BranchHeader: FC<UserHeaderProps> = ({ handlePrint, handleList }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Sucursales" image="laboratorio" />}
      className="header-container"
      extra={[
        <PrintIcon key="print" onClick={handlePrint} />,
        <DownloadIcon key="doc" onClick={handleList} />,
        <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            navigate(`/branches?search=${value}`);
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("new-sucursal");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default BranchHeader;
