import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import DeliveryResultsForm from "../components/deliveryResults/DeliveryResultsForm";
import DeliveryResultsHeader from "../components/deliveryResults/DeliveryResultsHeader";
import DeliveryResultsTable from "../components/deliveryResults/DeliveryResultsTable";
const handleDownload = async () => {};
const handlePrint = async () => {};
const DeliveryResults = () => {
  return (
    <>
      <DeliveryResultsHeader
        handleDownload={handleDownload}
        handlePrint={handlePrint}
      />
      <Divider />
      <DeliveryResultsForm />

      <DeliveryResultsTable />
    </>
  );
};
export default observer(DeliveryResults);
