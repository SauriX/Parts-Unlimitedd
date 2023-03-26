import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useStore } from "../app/stores/store";
import ClinicResultsBody from "../components/clinicResults/ClinicResultsBody";
import ClinicResultsHeader from "../components/clinicResults/ClinicResultsHeader";

const ClinicResults = () => {
  const { clinicResultsStore, generalStore } = useStore();
  const { scopes, access, clearScopes, exportList } = clinicResultsStore;
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
      <ClinicResultsHeader handleList={handleDownload} />
      <Divider className="header-divider" />
      <ClinicResultsBody printing={loading} formValues={generalFilter} />
    </Fragment>
  );
};

export default observer(ClinicResults);
