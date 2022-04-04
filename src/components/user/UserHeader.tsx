import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
const { Search } = Input;
type UserHeaderProps = {
  handlePrint: () => void;
};
const UserHeader: FC<UserHeaderProps> = ({ handlePrint }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo usuarios" image="user" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <Search key="search" placeholder="Buscar" onSearch={(value) => {navigate(`/users?search=${value}`);}} />,
        <Button key="new" type="primary" onClick={() => {navigate("/new-user");}} icon={<PlusOutlined />}>
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default UserHeader;
