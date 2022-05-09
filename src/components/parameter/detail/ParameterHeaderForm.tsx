import { PageHeader } from "antd";
import React, { FC, useEffect } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate,useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
type ParameterFormHeaderProps = {
    handlePrint: () => void;
    handleDownload:()=>void;
};
type UrlParams = {
    id: string;
};
const ParameterFormHeader: FC<ParameterFormHeaderProps> = ({ handlePrint,handleDownload }) => {
    let { id } = useParams<UrlParams>();
    let navigate = useNavigate();
    return (
        <PageHeader
            ghost={false}
            title={<HeaderTitle title="Catálogo Parámetros" image="parameters" />}
            className="header-container"
            extra={[
                <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
                id?<ImageButton key="doc" title="Informe" image="doc"  onClick={handleDownload}/>:"",
                <ImageButton
                  key="back"
                  title="Regresar"
                  image="back"
                  onClick={() => {
                    navigate("/parameters");
                  }}
                />,
            ]}
        ></PageHeader>
    );
}
export default ParameterFormHeader;