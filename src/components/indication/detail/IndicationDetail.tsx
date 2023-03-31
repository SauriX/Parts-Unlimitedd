import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import IndicationForm from "./IndicationForm";
import IndicationFormHeader from "./IndicationFormHeader";

type UrlParams = {
  id: string;
};

const IndicationDetail = () => {
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
  const indicationId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  useEffect(() => {
    if (indicationId === undefined) {
      navigate("/notFound");
    }
  }, [navigate, indicationId]);

  if (indicationId === undefined) {
    return null;
  }

  return (
    <Fragment>
      <IndicationFormHeader id={indicationId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <IndicationForm
        id={indicationId!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default IndicationDetail;
