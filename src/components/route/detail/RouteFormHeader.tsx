import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";

type RouteFormHeaderProps = {
  id: string;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const RouteFormHeader: FC<RouteFormHeaderProps> = ({ id, handlePrint, handleDownload }) => {
  const { routeStore } = useStore();
  const { scopes } = routeStore;

  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.route}?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Rutas" image="route" />}
      className="header-container"
      extra={[
        !!id && scopes?.imprimir && (
          <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />
        ),
        !!id && scopes?.descargar && (
          <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />
        ),
        <ImageButton key="back" title="Regresar" image="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default observer(RouteFormHeader);
