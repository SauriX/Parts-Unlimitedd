import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IOptionsCatalog } from "../../../app/models/shared";
import { catalogs } from "../../../app/util/catalogs";
import CatalogForm from "./CatalogForm";
import CatalogFormHeader from "./CatalogFormHeader";

type UrlParams = {
  id: string;
};

const CatalogDetail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [printing, setPrinting] = useState(false);
  const [catalog] = useState<IOptionsCatalog | undefined>(
    catalogs.find((x) => x.value === searchParams.get("catalog"))
  );

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
    if (reagentId === undefined || !catalog) {
      navigate("/notFound");
    }
  }, [catalog, navigate, reagentId]);

  if (reagentId === undefined || !catalog) return null;

  return (
    <Fragment>
      <CatalogFormHeader id={reagentId} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <CatalogForm id={reagentId} catalog={catalog} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default CatalogDetail;
