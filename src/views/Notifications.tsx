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
<<<<<<< HEAD
  const [type, setType] = useState<number>(1);
  const handleDownload = () => {};
  const handlePrint = () => {};
=======
  const [searchParams, setSearchParams] = useSearchParams();
  const [type,setType] = useState<number>(searchParams.get("type")?Number.parseInt(searchParams.get("type")!):1);
  const handleDownload = () => {
    console.log("handleDownload");
  };
  const handlePrint = () => {
    console.log("handlePrint");
  };
>>>>>>> 4373451d92275a87d7688697d2895d7e908eaa98
  return (
    <>
      <NotificationsHeader
        handleDownload={handleDownload}
        handlePrint={handlePrint}
        type={type}
        setType={setType}
      />
      <Divider />
      {type === 1 ? <NotificationsTable /> : <AvisosTable />}
    </>
  );
};
export default observer(Notifications);
