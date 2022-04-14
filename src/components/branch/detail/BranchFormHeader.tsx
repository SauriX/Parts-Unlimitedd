import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate,useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

type BranchFormHeaderProps = {
  handlePrint: () => void;
  handleDownload:()=>void;
};
type UrlParams = {
  id: string;
};
const BranchFormHeader: FC<BranchFormHeaderProps> = ({handlePrint,handleDownload }) => {
  let { id } = useParams<UrlParams>();
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Sucursales" image="reagent" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/sucursales");
          }}
        />,
      ]}
    ></PageHeader>
  );
};
 
export default BranchFormHeader;
