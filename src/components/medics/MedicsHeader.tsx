import { Button, PageHeader, Input } from "antd";
import React from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const MedicsHeader = () => {
  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Medicos" image="reagent" />}
      className="header-container"
      extra={[
        <Search key="search" placeholder="Buscar" onSearch={() => {}} />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/medics/0");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default MedicsHeader;