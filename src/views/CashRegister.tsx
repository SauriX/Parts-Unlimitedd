import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import CashBody from "../components/cashRegister/CashBody";
import CashHeader from "../components/cashRegister/CashHeader";

const CashRegister = () => {
  const { cashRegisterStore } = useStore();
  const { scopes, filter, printPdf, clearScopes, access } = cashRegisterStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await printPdf(filter);
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
      <CashHeader handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <CashBody printing={loading} />
    </Fragment>
  );
};

export default observer(CashRegister);
