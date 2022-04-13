import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const { Search } = Input;
type IndicationFormHeaderProps = {
  handlePrint: () => void;
  id : number;
};

const IndicationFormHeader: FC<IndicationFormHeaderProps> = ({ id, handlePrint, }) => {
  const { indicationStore } = useStore();
  const { exportForm } = indicationStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Indicaciones" image="Indicaciones" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        id !=0 ?
        <ImageButton key="doc" title="Informe" image="doc" onClick={download} />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/indication");
          }}
        />,
        <Search
          key="search"
          placeholder="Buscar"
          //defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => {
            setSearchParams({ search: !value ? "all" : value });
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default IndicationFormHeader;
