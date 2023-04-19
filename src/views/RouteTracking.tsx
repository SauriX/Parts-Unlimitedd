import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import RouteTrackingHeader from "../components/routeTracking/RouteHeader";
import RouteTrackingTable from "../components/routeTracking/RouteTrackingTable";

const RouteTracking = () => {
  const { routeTrackingStore } = useStore();
  const { scopes, access, clearScopes, exportFormPending } =
    routeTrackingStore;

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
    // await exportFormPending(searchPending!);
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
      <RouteTrackingHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <RouteTrackingTable printing={loading} />
    </Fragment>
  );
};

export default observer(RouteTracking);
