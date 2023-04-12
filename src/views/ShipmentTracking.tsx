import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ShipmentTrackingHeader from "../components/routeTracking/shipment/ShipmentTrackingHeader";
import ShipmentTrackingDetail from "../components/routeTracking/shipment/ShipmentTrackingDetail";
type UrlParams = {
  id: string;
};

const ShipmentTracking = () => {
  const { shipmentTracking, routeTrackingStore } = useStore();
  const { scopes, access, clearScopes } =
    routeTrackingStore;
  const { printTicket } = shipmentTracking;
  const { id } = useParams<UrlParams>();

  const [loading, setLoading] = useState(false);

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });

  const handleDownload = async () => {
    setLoading(true);
    await printTicket(id!);
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <ShipmentTrackingHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <ShipmentTrackingDetail componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(ShipmentTracking);
