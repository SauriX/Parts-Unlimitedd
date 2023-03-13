import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { useStore } from "../../../app/stores/store";

function RouteTrackingCreateHeader() {
  const navigate = useNavigate();
  const { trackingOrderStore, routeTrackingStore } = useStore();
  const { exportList, clearTrackingOrders } = trackingOrderStore;
  const { searchrecive, getAll } = routeTrackingStore;

  const download = async () => {
    await exportList();
  };

  const goBack = async () => {
    clearTrackingOrders();
    await getAll(searchrecive);
    navigate(`/segRutas`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title="Creación de orden de seguimiento"
          image="ordenseguimiento"
        />
      }
      className="header-container"
      extra={[
        <GoBackIcon key="back" onClick={goBack} />,
        <DownloadIcon onClick={download} />,
      ]}
    ></PageHeader>
  );
}

export default observer(RouteTrackingCreateHeader);
