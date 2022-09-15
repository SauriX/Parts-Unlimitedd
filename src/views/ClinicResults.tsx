import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useStore } from "../app/stores/store";
import ClinicResultsBody from "../components/clinicResults/ClinicResultsBody";
import ClinicResultsHeader from "../components/clinicResults/ClinicResultsHeader";

const ClinicResults = () => {
  const { clinicResultsStore } = useStore();
  const { scopes, access, clearScopes, exportList, formValues } =
    clinicResultsStore;
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await exportList(formValues);
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
      <ClinicResultsBody printing={loading} formValues={formValues}/>
    </Fragment>
  );
};

export default observer(ClinicResults);
