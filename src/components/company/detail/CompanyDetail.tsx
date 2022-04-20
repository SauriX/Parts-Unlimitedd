import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import CompanyForm from "./CompanyForm";
import CompanyFormHeader from "./CompanyFormHeader";

type UrlParams = {
  id: string;
};

const CompanyDetail = () => {
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
  const companyId = !id ? 0 : isNaN(Number(parseInt(id))) ? undefined : parseInt(id);

  useEffect(() => {
    console.log(companyId);
    if (companyId === undefined) {
      navigate("/notFound");
    }
  }, [navigate, companyId]);

  if (companyId === undefined) return null;

  return (
    <Fragment>
      <CompanyFormHeader id={companyId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <CompanyForm
        id={companyId!}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default CompanyDetail;
