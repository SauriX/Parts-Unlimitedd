import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useStore } from "../app/stores/store";
import RequestedStudyBody from "../components/requestedStudy/RequestedStudyBody";
import RequestedStudyHeader from "../components/requestedStudy/RequestedStudyHeader";

const RequestedStudy = () => {
  const { requestedStudyStore, generalStore } = useStore();
  const { scopes, access, clearScopes, exportList } = requestedStudyStore;
  const { generalFilter } = generalStore;
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await exportList(generalFilter);
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
      <RequestedStudyHeader handleList={handleDownload} /> 
      <Divider className="header-divider" />
      <RequestedStudyBody printing={loading} />
    </Fragment>
  );
};

export default observer(RequestedStudy);
