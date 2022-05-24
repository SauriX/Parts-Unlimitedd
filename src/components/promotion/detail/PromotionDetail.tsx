import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import PromotionForm from "./PromotionForm";
import PromotionFormHeader from "./PromotionFormHeader";

type UrlParams = {
  id: string;
};

const PromotionDetail = () => {
  const { promotionStore } = useStore();
  const { scopes, access, clearScopes, exportForm } = promotionStore; 

  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const reagentId = id;//!id ? "" : !guidPattern.test(id) ? undefined : id;

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
    if (reagentId) {
      setPrinting(true);
      await exportForm(reagentId);
      setPrinting(false);
    }
  };

/*   useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

       if (id === undefined) {
        console.log("undefined");
        navigate("/notFound");
      } else if (!permissions?.crear && id === "") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && id!== "") {
        navigate(`/forbidden`);
      } 
    };

    checkAccess();
  }, [ access , navigate, id]); */

   useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);
 
  //if (reagentId == null) return null;

/*   if (!scopes?.acceder) return null; */

  return (
    <Fragment>
      <PromotionFormHeader id={reagentId!} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <PromotionForm id={reagentId!} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(PromotionDetail);
