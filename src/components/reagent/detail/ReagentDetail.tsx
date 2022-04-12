import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ReagentForm from "./ReagentForm";
import ReagentFormHeader from "./ReagentFormHeader";

type UrlParams = {
  id: string;
};

const ReagentDetail = () => {
  const navigate = useNavigate();

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
  const reagentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  useEffect(() => {
    if (reagentId === undefined) {
      navigate("/notFound");
    }
  }, [navigate, reagentId]);

  if (reagentId === undefined) return null;

  return (
    <Fragment>
      <ReagentFormHeader id={reagentId} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <ReagentForm id={reagentId} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default ReagentDetail;