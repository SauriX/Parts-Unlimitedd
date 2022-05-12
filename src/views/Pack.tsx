import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import PackHeader from "../components/pack/PackHeader";
import PackTable from "../components/pack/PackTable";


const Pack = () => {
  const { packStore  } = useStore();
  const { exportList,access,clearScopes,scopes }=packStore;
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

  //if (!scopes?.acceder) return null;

  return (
    <Fragment>
       <PackHeader handlePrint={handlePrint} handleList={handleDownload} />
      <Divider className="header-divider" />
      <PackTable componentRef={componentRef} printing={loading} /> 
    </Fragment>
  );
};

export default observer(Pack);
