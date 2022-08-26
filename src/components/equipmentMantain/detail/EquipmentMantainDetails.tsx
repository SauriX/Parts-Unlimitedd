import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import EquipmentForm from "./EquipmentMantainForm";
import EquipmentFormHeader from "./EquipmentFormHeader";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

type UrlParams = {
  id: string;
};

const EquipmentMantainDetails = () => {
  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

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

  const { id } = useParams<UrlParams>();
  const equipmentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);
  console.log(equipmentId,"elid");
   const mantainid = !id?"":isNaN(Number(id)) ? id : null;


/*   if (equipmentId === undefined) {
    return null;
  }
 */
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
