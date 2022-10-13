import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import RouteHeader from "../components/route/RouteHeader";
import RouteTable from "../components/route/RouteTable";
import RouteTrackingHeader from "../components/routeTracking/RouteHeader";
import RouteTrackingTable from "../components/routeTracking/RouteTrackingTable";

const RouteTracking = () => {
  const { routeTrackingStore } = useStore();
  const { scopes, access, clearScopes, exportFormPending,searchPending } = routeTrackingStore;

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
    await exportFormPending(searchPending!);
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
      <RouteTrackingHeader handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <RouteTrackingTable componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(RouteTracking);
