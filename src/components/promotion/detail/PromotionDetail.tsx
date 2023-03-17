import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
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
  const promoId = !id ? 0 : isNaN(Number(id)) ? undefined : Number(id);

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
    if (promoId) {
      setPrinting(true);
      await exportForm(promoId);
      setPrinting(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

      if (promoId === undefined) {
        navigate("/notFound");
      } else if (!permissions?.crear && promoId === 0) {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && promoId !== 0) {
        navigate(`/forbidden`);
      }
    };

    checkAccess();
  }, [access, navigate, promoId]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (promoId == null) return null;

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <PromotionFormHeader
        id={promoId!}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <PromotionForm
        id={promoId!}
        componentRef={componentRef}
        printing={printing}
        download={printing}
      />
    </Fragment>
  );
};

export default observer(PromotionDetail);
