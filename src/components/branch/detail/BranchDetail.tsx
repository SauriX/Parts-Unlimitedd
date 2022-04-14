import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BranchForm from "./BranchForm";
import BranchFormHeader from "./BranchFormHeader";

type UrlParams = {
  id: string;
};

const BranchDetail = () => {
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


  return (
    <Fragment>
      <BranchFormHeader  handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <BranchForm  componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default BranchDetail;
