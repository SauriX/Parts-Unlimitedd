import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";

const { Search } = Input;

type IndicationsHeaderProps = {
  handlePrint: () => void;
};

const IndicationHeader: FC<IndicationsHeaderProps> = ({ handlePrint }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Indicaciones" image="reagent" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <Search 
        key="search" 
        placeholder="Buscar" 
        //defaultValue={searchParams.get("search") ?? ""}
        onSearch={(value) => {
          setSearchParams({ search: !value ? "all" : value });
        }} />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/indication/0");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default IndicationHeader;