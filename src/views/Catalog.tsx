import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IOptionsCatalog } from "../app/models/shared";
import { useStore } from "../app/stores/store";
import CatalogHeader from "../components/catalog/CatalogHeader";
import CatalogTable from "../components/catalog/CatalogTable";

const Catalog = () => {
  const { catalogStore } = useStore();
  const { setCurrentCatalog, access, clearScopes } = catalogStore;

  const [searchParams] = useSearchParams();

  const [printing, setPrinting] = useState(false);
  const [catalog, setCatalog] = useState<IOptionsCatalog>();

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

  useEffect(() => {
    const checkAccess = async () => {
      // await access();
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    setCurrentCatalog(searchParams.get("catalog") ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Render");

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  // if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <CatalogHeader catalog={catalog} handlePrint={handlePrint} setCatalog={setCatalog} />
      <Divider className="header-divider" />
      <CatalogTable componentRef={componentRef} printing={printing} catalog={catalog} />
    </Fragment>
  );
};

export default Catalog;
