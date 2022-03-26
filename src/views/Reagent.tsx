import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReagentHeader from "../components/reagent/ReagentHeader";
import ReagentTable from "../components/reagent/ReagentTable";

const Reagent = () => {
  const { reagentStore } = useStore();
  const { scopes, access, clearScopes } = reagentStore;

  const [printing, setPrinting] = useState(false);

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [access]);

  console.log("Render");

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <ReagentHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <ReagentTable componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(Reagent);
