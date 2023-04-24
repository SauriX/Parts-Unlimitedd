import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReceiveTrackingDetail from "../components/routeTracking/receive/ReceiveTrackingDetail";
import ReceiveTrackingHeader from "../components/routeTracking/receive/ReceiveTrackingHeader";

type UrlParams = {
  id: string;
};

const ReceiveTracking = () => {
  const { shipmentTracking, routeTrackingStore } = useStore();
  const { scopes, access, clearScopes } = routeTrackingStore;
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
      <ReceiveTrackingHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <ReceiveTrackingDetail componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(ReceiveTracking);
