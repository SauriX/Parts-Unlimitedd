import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import BranchHeader from "../components/branch/BranchHeader";
import BranchTable from "../components/branch/BranchTable";
const Branch = () => {
  const { userStore } = useStore();
  const { access } = userStore;
  const [printing, setPrinting] = useState(false);
  const [accessing, setAccessing] = useState(true);
  useEffect(() => {
    const checkAccess = async () => {
      await access();
      setAccessing(false);
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    return () => {
      setAccessing(true);
    };
  }, []);
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
  return (
    <Fragment>
    <BranchHeader handlePrint={handlePrint} handleList={()=>{}}/>
    <Divider className="header-divider" />
    <BranchTable componentRef={componentRef} printing={printing}/>
    </Fragment>
  );
};

export default Branch;
