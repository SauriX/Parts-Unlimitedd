import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useStore } from "../app/stores/store";
import IndicationHeader from "../components/indication/IndicationHeader";
import IndicationTable from "../components/indication/IndicationTable";

const Indication = () => {
  const { indicationStore } = useStore();
  const { scopes, access, clearScopes } = indicationStore;

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
      <IndicationHeader />
      <Divider className="header-divider" />
      <IndicationTable />
    </Fragment>
  );
};

export default observer(Indication);
