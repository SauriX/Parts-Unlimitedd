import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AvisosTable from "../components/notifications/AvisosTable";
import NotificationsHeader from "../components/notifications/NotificationsHeader";
import NotificationsTable from "../components/notifications/NotificationsTable";

const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [type, setType] = useState<number>(Number(searchParams.get("type")));
  const handleDownload = () => {};
  const handlePrint = () => {};
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
