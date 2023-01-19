import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { useStore } from "../app/stores/store";
import DeliveryResultsForm from "../components/deliveryResults/DeliveryResultsForm";
import DeliveryResultsHeader from "../components/deliveryResults/DeliveryResultsHeader";
import DeliveryResultsTable from "../components/deliveryResults/DeliveryResultsTable";
const { useReactToPrint } = require("react-to-print");
const DeliveryResults = () => {
  const { massResultSearchStore } = useStore();
  const { formDeliverResult, exportListDeliverResult } = massResultSearchStore;
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
    await exportListDeliverResult(formDeliverResult);
    setLoading(false);
  };
  return (
    <>
      <DeliveryResultsHeader
        handleDownload={handleDownload}
        handlePrint={handlePrint}
      />
      <Divider />
      <DeliveryResultsForm />
      <DeliveryResultsTable componentRef={componentRef} printing={loading} />
    </>
  );
};
export default observer(DeliveryResults);
