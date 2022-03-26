import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useStore } from "../app/stores/store";
import MedicsHeader from "../components/medics/MedicsHeader";
import MedicsTable from "../components/medics/MedicsTable";

const Medics = () => {
  const { medicsStore } = useStore();
  const { scopes, access, clearScopes } = medicsStore;

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
      <MedicsHeader />
      <Divider className="header-divider" />
      <MedicsTable />
    </Fragment>
  );
};

export default observer(Medics);