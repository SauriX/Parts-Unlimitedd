import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import EquipmentHeader from "../components/equipment/EquipmentHeader";
import EquipmentTable from "../components/equipment/EquipmentTable";

const Equipment = () => {
  const { equipmentStore } = useStore();
  const { scopes, access, clearScopes } = equipmentStore;

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
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  return (
    <Fragment>
      <EquipmentHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <EquipmentTable componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(Equipment);
