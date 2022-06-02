import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IOptionsCatalog } from "../app/models/shared";
import { useStore } from "../app/stores/store";
import CatalogHeader from "../components/catalog/CatalogHeader";
import CatalogTable from "../components/catalog/CatalogTable";

const Catalog = () => {
  const { catalogStore } = useStore();
  const { scopes, setCurrentCatalog, access, clearScopes, exportList } = catalogStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<IOptionsCatalog>();

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });

  const handleDownload = async () => {
    setLoading(true);
    await exportList(searchParams.get("catalog") ?? "", searchParams.get("search") ?? "all");
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    setCurrentCatalog(searchParams.get("catalog") ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <CatalogHeader
        catalog={catalog}
        setCatalog={setCatalog}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <CatalogTable componentRef={componentRef} printing={loading} catalog={catalog} />
    </Fragment>
  );
};

export default observer(Catalog);
