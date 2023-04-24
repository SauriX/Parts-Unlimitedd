import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { useStore } from "../../../app/stores/store";

type UrlParams = {
  id: string;
};

function RouteTrackingCreateHeader() {
  const navigate = useNavigate();
  const { trackingOrderStore } = useStore();
  const { exportList } = trackingOrderStore;

  const { id } = useParams<UrlParams>();

  const download = async () => {
    await exportList();
  };

  const goBack = async () => {
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
      extra={
        <Fragment>
          <GoBackIcon key="back" onClick={goBack} />

          {id ? <DownloadIcon onClick={download} /> : ""}
        </Fragment>
      }
    ></PageHeader>
  );
}

export default observer(RouteTrackingCreateHeader);
