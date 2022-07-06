import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IOptionsCatalog } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { catalogs } from "../../../app/util/catalogs";
import CatalogForm from "./CatalogForm";
import CatalogFormHeader from "./CatalogFormHeader";

type UrlParams = {
  id: string;
};

const CatalogDetail = () => {
  const { catalogStore } = useStore();
  const { exportForm } = catalogStore;

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
  const catalogId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  const handleDownload = async () => {
    const catalog = searchParams.get("catalog");
    if (catalog && catalogId) {
      setPrinting(true);
      await exportForm(catalog, catalogId);
      setPrinting(false);
    }
  };

  useEffect(() => {
    if (catalogId === undefined || !catalog) {
      navigate("/notFound");
    }
  }, [catalog, navigate, catalogId]);

  if (catalogId === undefined || !catalog) return null;

  return (
    <Fragment>
      <CatalogFormHeader id={catalogId} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <CatalogForm id={catalogId} catalog={catalog} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default CatalogDetail;
