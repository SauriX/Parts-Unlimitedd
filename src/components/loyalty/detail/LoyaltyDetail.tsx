import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import LoyaltyForm from "./LoyaltyForm";
import LoyaltyFormHeader from "./LoyaltyFormHeader";

type UrlParams = {
  id: string;
};

const LoyaltyDetail = () => {
  const { loyaltyStore } = useStore();
  const { scopes, access, clearScopes, exportForm } = loyaltyStore;

  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const loyaltyId = !id ? "" : !guidPattern.test(id) ? undefined : id;

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
    if (loyaltyId) {
      setPrinting(true);
      await exportForm(loyaltyId);
      setPrinting(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

    //   if (loyaltyId === undefined) {
    //     console.log("undefined");
    //     navigate("/notFound");
    //   } else if (!permissions?.crear && loyaltyId === "") {
    //     navigate(`/forbidden`);
    //   } else if (!permissions?.modificar && loyaltyId !== "") {
    //     navigate(`/forbidden`);
    //   }
    };

    checkAccess();
  }, [access, navigate, loyaltyId]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (loyaltyId == null) return null;

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <LoyaltyFormHeader id={loyaltyId} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <LoyaltyForm id={loyaltyId} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(LoyaltyDetail);
