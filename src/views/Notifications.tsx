import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import NotificationsHeader from "../components/notifications/NotificationsHeader";
import NotificationsTable from "../components/notifications/NotificationsTable";

const Notifications = () => {
  const handleDownload = () => {
    console.log("handleDownload");
  };
  const handlePrint = () => {
    console.log("handlePrint");
  };
  return (
    <>
      <NotificationsHeader
        handleDownload={handleDownload}
        handlePrint={handlePrint}
      />
      <Divider />
      <NotificationsTable />
    </>
  );
};
export default observer(Notifications);
