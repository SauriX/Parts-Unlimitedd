import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import ErrorComponent from "../../app/layout/ErrorComponent";
import { useStore } from "../../app/stores/store";
import messages from "../../app/util/messages";
import ConfigurationTab from "./ConfigurationTab";

const Configuration = () => {
  const { configurationStore } = useStore();
  const { scopes, access, clearScopes } = configurationStore;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      await access();
      setLoading(false);
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (loading) return null;

  return !scopes?.acceder ? (
    <ErrorComponent status={403} message={messages.forbidden} hideButton />
  ) : (
    <ConfigurationTab />
  );
};

export default observer(Configuration);
