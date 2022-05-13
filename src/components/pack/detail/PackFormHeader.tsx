import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

type BranchFormHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => void;
};
type UrlParams = {
  id: string;
};
const PackFormHeader: FC<BranchFormHeaderProps> = ({ handlePrint, handleDownload }) => {
  let { id } = useParams<UrlParams>();
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
      className="header-container"
      extra={[
        id?<ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:"",
        id?<ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />:"",
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate(`/${views.pack}`);
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default PackFormHeader;
