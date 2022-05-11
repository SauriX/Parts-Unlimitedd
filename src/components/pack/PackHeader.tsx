import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";
import views from "../../app/util/view";

const { Search } = Input;
type UserHeaderProps = {
  handlePrint: () => void;
  handleList: () => void;
};
const PackHeader: FC<UserHeaderProps> = ({ handlePrint, handleList }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" onClick={handleList} />,
        <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            navigate(`/${views.pack}?search=${value}`);
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("new-pack");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default PackHeader;
