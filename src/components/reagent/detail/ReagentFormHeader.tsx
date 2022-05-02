import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";

type ReagentFormHeaderProps = {
  id: number;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const ReagentFormHeader: FC<ReagentFormHeaderProps> = ({ id, handlePrint, handleDownload }) => {
  const { reagentStore } = useStore();
  const { scopes, exportForm } = reagentStore;

  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.reagent}?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
      className="header-container"
      extra={[
        scopes?.imprimir && <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        !!id && scopes?.descargar && (
          <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />
        ),
        <ImageButton key="back" title="Regresar" image="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default observer(ReagentFormHeader);
