import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
const { Search } = Input;
type RoleHeaderProps = {
  handlePrint: () => void;
  handleList:() => void;
};
const RoleHeader: FC<RoleHeaderProps> = ({ handlePrint,handleList }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Roles" image="role" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc"onClick={handleList} />,
        <Search key="search" placeholder="Buscar" onSearch={(value) => {navigate(`/roles?search=${value}`);}} />,
        <Button key="new" type="primary" onClick={() => {navigate("/roles/new-role");}} icon={<PlusOutlined />}>
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default RoleHeader;
