import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const { Search } = Input;
type MedicsFormHeaderProps = {
  handlePrint: () => void;
  id : string;
};

const MedicsFormHeader: FC<MedicsFormHeaderProps> = ({id, handlePrint }) => {
  const { medicsStore } = useStore();
  const { exportForm } = medicsStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
      className="header-container"
      extra={[
        id? <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:"",
        id? <ImageButton key="doc" title="Informe" image="doc" onClick={download}  />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/medics");
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

export default MedicsFormHeader;
