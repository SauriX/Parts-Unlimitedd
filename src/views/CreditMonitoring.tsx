import { observer } from "mobx-react-lite";
import CreditMonitoringForm from "../components/CreditMonitoring/CreditMonitoringForm";
import CreditMonitoringHeader from "../components/CreditMonitoring/CreditMonitoringHeader";
import CreditMonitoringTable from "../components/CreditMonitoring/CreditMonitoringTable";

const CreditMonitoring = () => {
  return (
    <>
      <CreditMonitoringHeader handleDownload={() => {}} />
      <CreditMonitoringForm />
      <CreditMonitoringTable />
    </>
  );
};

export default observer(CreditMonitoring);
