import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useKeyPress } from "../../../app/hooks/useKeyPress";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import ProceedingForm from "./ProceedingForm";
import ProceedingFormHeader from "./ProceedingFormHeader";

type UrlParams = {
  id: string;
};

const ProceedingDetail = () => {
  const { procedingStore } = useStore();
  const { exportForm } = procedingStore;

  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useKeyPress("V", () => navigate(`/requests/${id}`));

  const { id } = useParams<UrlParams>();
  const reagentId = !id ? "" : !guidPattern.test(id) ? undefined : id;

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
      setIsPrinting(true);
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
      setIsPrinting(false);
      await exportForm(reagentId);
      setPrinting(false);
    }
  };

  return (
    <Fragment>
      <ProceedingFormHeader
        id={reagentId!}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <ProceedingForm
        id={reagentId!}
        componentRef={componentRef}
        printing={printing}
        isPrinting={isPrinting}
      />
    </Fragment>
  );
};

export default observer(ProceedingDetail);
