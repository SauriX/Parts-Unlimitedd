import { Button, PageHeader, Input } from "antd";
import React, { FC, useState } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Search } = Input;

type apointmentHeaderFormProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  id: string;
};

const ApointmentHeaderForm: FC<apointmentHeaderFormProps> = ({ handlePrint, handleDownload,id }) => {
  // const { apointmentStore } = useStore();
  //const { /* scopes, */ getAll, exportList } = apointmentStore; 

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [tipo,setTipo]=useState(searchParams.get("type"));
  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;

  /*   await getAll(search ?? "all"); */

    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };
  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.appointment}?${searchParams}`);
    
  };
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title={`Cita ${tipo!="laboratorio"?"Domicilio":"Laboratorio"}`} image="" />}
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

export default ApointmentHeaderForm;
