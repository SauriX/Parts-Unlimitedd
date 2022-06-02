import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import LoyaltyHeader from "../components/loyalty/LoyaltyHeader";
import LoyaltyTable from "../components/loyalty/LoyaltyTable";

const Loyalty = () => {
  const { loyaltyStore } = useStore();
  const { scopes, access, clearScopes, exportList } = loyaltyStore;

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
    await exportList(searchParams.get("search") ?? "all");
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
      <LoyaltyHeader handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <LoyaltyTable id = "" componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(Loyalty);
