import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";


const { Search } = Input;
type CompanyFormHeaderProps = {
  handlePrint: () => void;
  id : string;
};

const CompanyFormHeader: FC<CompanyFormHeaderProps> = ({id, handlePrint }) => {
  const { companyStore } = useStore();
  const { exportForm } = companyStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Compañias" image="compañia" />}
      className="header-container"
      extra={[
        id? <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:'',
        id? <ImageButton key="doc" title="Informe" image="doc" onClick={download}  />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/companies");
          }}
        />,
        
      ]}
    ></PageHeader>
  );
};

export default CompanyFormHeader;
