import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import CreationTrackingOrderForm from "./CreationTrackingOrderForm";
import CreationTrackingOrderHeader from "./CreationTrackingOrderHeader";
import CreationTrackingOrderTable from "./CreationTrackingOrderTable";

const CreationTrackingOrder = () => {
  // const {trackingOrderStore} = useStore();
  // const { scopes, access, clearScopes } = trackingOrderStore;

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
  // useEffect(() => {
  //   return () => {
  //     clearScopes();
  //   };
  // }, [clearScopes]);
  return (
    <Fragment>
      <CreationTrackingOrderHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <CreationTrackingOrderForm
        id={0}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default observer(CreationTrackingOrder);
