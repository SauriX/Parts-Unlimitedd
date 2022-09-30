import { Col, Divider, Row } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import RouteHeader from "../components/route/RouteHeader";
import RouteTable from "../components/route/RouteTable";
import RouteTrackingHeader from "../components/routeTracking/RouteHeader";
import RouteTrackingTable from "../components/routeTracking/RouteTrackingTable";
import ShipmentTrackingHeader from "../components/shipmentTracking/ShipmentTacking";
import ShipmentTrackingDetail from "../components/shipmentTracking/ShipmentTrackingDetail";
type UrlParams = {
  id: string;
};

const ShipmentTracking = () => {
  const { routeStore } = useStore();

  const { routeTrackingStore,shipmentTracking} = useStore();
  const { id } = useParams<UrlParams>();
  
    const {getAll,studys}= routeTrackingStore;
    const { getashipment,shipment,access,printTicket}=shipmentTracking;
  const [searchParams] = useSearchParams();

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

/*   useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]); */

  //if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <ShipmentTrackingHeader handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <ShipmentTrackingDetail componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(ShipmentTracking);
