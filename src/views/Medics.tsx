import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import MedicsHeader from "../components/medics/MedicsHeader";
import MedicsTable from "../components/medics/MedicsTable";

const Medics = () => {
  const { medicsStore } = useStore();
  const { scopes, access, clearScopes } = medicsStore;

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
      <MedicsHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <MedicsTable componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(Medics);