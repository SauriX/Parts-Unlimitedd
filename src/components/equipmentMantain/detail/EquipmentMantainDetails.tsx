import { Divider } from "antd";
import { Fragment, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import EquipmentForm from "./EquipmentMantainForm";
import EquipmentFormHeader from "./EquipmentFormHeader";

type UrlParams = {
  id: string;
  ide: string;
};

const EquipmentMantainDetails = () => {
  const [printing, setPrinting] = useState(false);

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  const { id, ide } = useParams<UrlParams>();
  const equipmentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);
  const mantainid = !ide ? "" : isNaN(Number(id)) ? id : null;

  return (
    <Fragment>
      <EquipmentFormHeader id={equipmentId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <EquipmentForm
        id={equipmentId!}
        idmantain={mantainid!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default EquipmentMantainDetails;
