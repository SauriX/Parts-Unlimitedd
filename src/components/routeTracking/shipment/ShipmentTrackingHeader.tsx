import { PageHeader } from "antd";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import views from "../../../app/util/view";
import { observer } from "mobx-react-lite";

type ShipmentTrackingProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const ShipmentTrackingHeader: FC<ShipmentTrackingProps> = ({
  handlePrint,
  handleDownload,
}) => {
  const { routeStore } = useStore();
  const { scopes } = routeStore;

  const navigate = useNavigate();

  const getBack = () => {
    navigate(`/${views.routeTracking}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title="Detalle de seguimiento de envio" image="segruta" />
      }
      className="header-container"
      extra={[
        scopes?.imprimir && <PrintIcon key="print" onClick={handlePrint} />,
        <GoBackIcon key="back" onClick={getBack} />,
        <DownloadIcon key="doc" onClick={handleDownload} />,
      ]}
    ></PageHeader>
  );
};

export default observer(ShipmentTrackingHeader);
