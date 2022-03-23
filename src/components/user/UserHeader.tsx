import { Button, PageHeader, Input } from "antd";
import React from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const UserHeader = () => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo usuarios" image="user" />}
      className="header-container"
      extra={[
        <Search key="search" placeholder="Buscar" onSearch={() => {}} />,
        <Button key="new" type="primary" onClick={() => {}} icon={<PlusOutlined />}>
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default UserHeader;
