import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import MedicsForm from "./MedicsForm";
import MedicsFormHeader from "./MedicsFormHeader";

type UrlParams = {
  id: string;
};

const MedicsDetail = () => {
  let navigate = useNavigate();

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
  const medicsId = !id ? undefined : id;

  useEffect(() => {}, [navigate, medicsId]);

  return (
    <Fragment>
      <MedicsFormHeader id={medicsId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <MedicsForm
        id={medicsId!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default MedicsDetail;
