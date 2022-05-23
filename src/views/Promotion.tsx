import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import PromotionHeader from "../components/promotion/PromotionHeader";
import PromotionTable from "../components/promotion/PromotionTable";

const Promotion = () => {
  const { promotionStore } = useStore();
  const { scopes, access, clearScopes, exportList } =promotionStore ;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

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
    await exportList(searchParams.get("search") ?? "all");
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [ access ]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [ clearScopes ]);

  //if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <PromotionHeader handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <PromotionTable componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(Promotion);
