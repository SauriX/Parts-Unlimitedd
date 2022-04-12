import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

type ReagentFormHeaderProps = {
  id: number;
  handlePrint: () => void;
};

const ReagentFormHeader: FC<ReagentFormHeaderProps> = ({ id, handlePrint }) => {
  const { reagentStore } = useStore();
  const { exportForm } = reagentStore;

  let navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc" onClick={download} />,
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/reagent");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default ReagentFormHeader;