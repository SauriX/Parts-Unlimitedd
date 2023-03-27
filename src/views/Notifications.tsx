import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AvisosTable from "../components/notifications/AvisosTable";
import NotificationsHeader from "../components/notifications/NotificationsHeader";
import NotificationsTable from "../components/notifications/NotificationsTable";
type UrlParams = {
  id: string;
};
const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type,setType] = useState<number>(searchParams.get("type")?Number.parseInt(searchParams.get("type")!):1);
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
        type={type}
        setType={setType}
      />
      <Divider />
      {type===1?<NotificationsTable />:<AvisosTable />}
      
    </>
  );
};
export default observer(Notifications);
