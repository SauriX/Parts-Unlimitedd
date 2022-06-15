import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Search } = Input;

type ProceedingProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  id: string;
};

const ProceedingFormHeader: FC<ProceedingProps> = ({ handlePrint, handleDownload,id }) => {
    const {  } = useStore();
    /* const { scopes } = ; */ 
   console.log("el id de la promo");
   console.log(id);
   let navigate = useNavigate();
 
   const [searchParams, setSearchParams] = useSearchParams();
 
   const getBack = () => {
     searchParams.delete("mode");
     setSearchParams(searchParams);
     navigate(`/${views.promo}?${searchParams}`);
   };
  /*  console.log(scopes); */
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="EXPEDIENTE"  />}
      className="header-container"
      extra={[
        id &&/* scopes?.imprimir && */  <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
         id && /* scopes?.descargar *//*  && */  (
          <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />
        ),
        <ImageButton key="back" title="Regresar" image="back" onClick={getBack} />,
      ]}
    ></PageHeader>
    
  );
};

export default ProceedingFormHeader;
