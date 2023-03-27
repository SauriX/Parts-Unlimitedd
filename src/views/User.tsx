import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import UserHeader from "../components/user/UserHeader";
import UserTable from "../components/user/UserTable";

const User = () => {
  const { userStore } = useStore();
  const { access, exportList } = userStore;
  const [printing, setPrinting] = useState(false);
  const [accessing, setAccessing] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleDownload = async () => {
    setPrinting(true);
    var succes = await exportList(searchParams.get("search") ?? "all");
    // if(succes){
    setPrinting(false);
    // }
  };

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
  if (accessing) return null;

  return (
    <Fragment>
      <UserHeader handlePrint={handlePrint} handleList={handleDownload} />
      <Divider className="header-divider" />
      <UserTable componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(User);
