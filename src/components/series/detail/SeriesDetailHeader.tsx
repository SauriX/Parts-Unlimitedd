import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { useStore } from "../../../app/stores/store";

type SeriesDetailHeaderProps = {
  tipoSerie: string;
};

const SeriesDetailHeader = ({ tipoSerie }: SeriesDetailHeaderProps) => {
  const { seriesStore } = useStore();
  const { seriesType, setSeriesType } = seriesStore;

  let navigate = useNavigate();

  const getBack = () => {
    setSeriesType(0);
    navigate(`/series`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={
            tipoSerie === "1" ? "Catálogo de Facturas" : "Catálogo de Recibos"
          }
          image={tipoSerie === "1" ? "cuenta" : "recibo"}
        />
      }
      className="header-container"
      extra={[<GoBackIcon key="back" onClick={getBack} />]}
    ></PageHeader>
  );
};

export default observer(SeriesDetailHeader);
