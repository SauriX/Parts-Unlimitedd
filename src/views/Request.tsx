import { Divider } from "antd";
import { Fragment, useState } from "react";
import RequestHeader from "../components/request/RequestHeader";
import RequestRecord from "../components/request/RequestRecord";
import RequestTab from "../components/request/RequestTab";
import "../components/request/css/index.less";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../app/stores/store";

const Request = () => {
  const { profileStore } = useStore();
  const { profile } = profileStore;

  const { recordId } = useParams();

  const [branchId, setBranchId] = useState<string | undefined>(profile!.sucursal);

  if (!recordId) return null;

  return (
    <Fragment>
      <RequestHeader />
      <Divider className="header-divider" />
      <RequestRecord recordId={recordId} branchId={profile!.sucursal} setBranchId={setBranchId} />
      <RequestTab recordId={recordId} branchId={branchId} />
    </Fragment>
  );
};

export default observer(Request);
