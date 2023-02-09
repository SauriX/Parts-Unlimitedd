import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import PriceListForm from "./PriceListForm";
import PriceListFormHeader from "./PriceListFormHeader";

type UrlParams = {
  id: string;
};

const PriceListDetail = () => {
  const { priceListStore } = useStore();
  const { scopes, access, clearScopes, exportForm } = priceListStore;
  const [download, setDownload] = useState(false);
  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const priceListId = !id ? "" : !guidPattern.test(id) ? undefined : id;

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

  const handleDownload = async () => {
    if (priceListId) {
      setDownload(true);
      await exportForm(priceListId);
      setDownload(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

      if (priceListId === undefined) {
        console.log("undefined");
        navigate("/notFound");
      } else if (!permissions?.crear && priceListId === "") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && priceListId !== "") {
        navigate(`/forbidden`);
      }
    };

    checkAccess();
  }, [access, navigate, priceListId]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (priceListId == null) return null;

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <PriceListFormHeader
        id={priceListId}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <PriceListForm
        id={priceListId}
        componentRef={componentRef}
        printing={printing}
        download={download}
      />
    </Fragment>
  );
};

export default observer(PriceListDetail);
