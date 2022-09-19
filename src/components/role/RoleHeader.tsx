import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
const { Search } = Input;
type RoleHeaderProps = {
  handlePrint: () => void;
  handleList: () => void;
};
const RoleHeader: FC<RoleHeaderProps> = ({ handlePrint, handleList }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Roles" image="rol" />}
      className="header-container"
      extra={[
        <PrintIcon key="print" onClick={handlePrint} />,
        <DownloadIcon key="doc" onClick={handleList} />,
        <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            navigate(`/roles?search=${value}`);
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/roles/new-role");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default RoleHeader;
