import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import EquipmentMantainHeader from "../components/equipmentMantain/EquipmentHeader";
import EquipmentMantainData from "../components/equipmentMantain/EquipmentMantainData";

type UrlParams = {
  id: string;
};
const EquipmmentMantain = () => {
  const { indicationStore } = useStore();
  const { scopes, access, clearScopes } = indicationStore;

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

  const { id } = useParams<UrlParams>();
  const equipmentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);
  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  return (
    <Fragment>
      <EquipmentMantainHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <EquipmentMantainData
        componentRef={componentRef}
        printing={printing}
        id={equipmentId!}
      />
    </Fragment>
  );
};

export default observer(EquipmmentMantain);
