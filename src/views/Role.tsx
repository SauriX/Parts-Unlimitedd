 import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import RoleHeader from "../components/role/RoleHeader";
import RoleTable from "../components/role/RoleTable";
const Role = () => {
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
    <RoleHeader handlePrint={handlePrint}/>
    <Divider className="header-divider" />
    <RoleTable componentRef={componentRef} printing={printing}/>
    </Fragment>
  );
};

export default Role;
