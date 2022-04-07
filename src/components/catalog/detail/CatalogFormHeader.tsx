import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";

type CatalogFormHeaderProps = {
  id: number;
  handlePrint: () => void;
};

const CatalogFormHeader: FC<CatalogFormHeaderProps> = ({ id, handlePrint }) => {
  let navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/catalogs");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default CatalogFormHeader;
