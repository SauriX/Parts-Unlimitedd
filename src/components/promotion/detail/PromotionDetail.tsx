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
  const { clearScopes, exportForm } = promotionStore; 

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const reagentId = id;

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

   useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  return (
    <Fragment>
      <PromotionFormHeader id={reagentId!} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <PromotionForm id={reagentId!} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(PromotionDetail);
