import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useState, useRef } from "react";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import CreationTrackingOrderForm from "./CreationTrackingOrderForm";
import CreationTrackingOrderHeader from "./CreationTrackingOrderHeader";

type UrlParams = {
  id: string;
};

const CreationTrackingOrder = () => {
  const [printing, setPrinting] = useState(false);
  const { id } = useParams<UrlParams>();
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
      <CreationTrackingOrderHeader handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <CreationTrackingOrderForm
        id={id!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default observer(CreationTrackingOrder);
