import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useStore } from "../app/stores/store";
import ReagentHeader from "../components/reagent/ReagentHeader";
import ReagentTable from "../components/reagent/ReagentTable";

const Reagent = () => {
  const { reagentStore } = useStore();
  const { scopes, access, clearScopes } = reagentStore;

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
      <ReagentHeader />
      <Divider className="header-divider" />
      <ReagentTable />
    </Fragment>
  );
};

export default observer(Reagent);
