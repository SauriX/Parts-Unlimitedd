import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import MaquiladorForm from "./MaquiladorForm";
import MaquiladorFormHeader from "./MaquiladorFormHeader";

type UrlParams = {
  id: string;
};

const MaquiladorDetail = () => {
  let navigate = useNavigate();

  // const [searchParams, setSearchParams] = useSearchParams();

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
  const maquiladorId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  useEffect(() => {
    if (maquiladorId === undefined) {
      navigate("/notFound");
    }
  }, [navigate, maquiladorId]);

  if (maquiladorId === undefined) return null;

  return (
    <Fragment>
      <MaquiladorFormHeader id={maquiladorId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <MaquiladorForm
        id={maquiladorId!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default MaquiladorDetail;
