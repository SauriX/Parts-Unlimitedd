import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";

type RouteFormHeaderProps = {
  id: string;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const RouteFormHeader: FC<RouteFormHeaderProps> = ({
  id,
  handlePrint,
  handleDownload,
}) => {
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
      title={<HeaderTitle title="Catálogo de Rutas" image="ruta" />}
      className="header-container"
      extra={[
        !!id && scopes?.imprimir && (
          <PrintIcon key="print" onClick={handlePrint} />
        ),
        !!id && scopes?.descargar && (
          <DownloadIcon key="doc" onClick={handleDownload} />
        ),
        <GoBackIcon key="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default observer(RouteFormHeader);
