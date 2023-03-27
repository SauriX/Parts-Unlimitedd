import { Divider } from "antd";
import { Fragment } from "react";
import { useStore } from "../app/stores/store";
import RequestHeader from "../components/request/list/RequestHeader";
import RequestFilter from "../components/request/list/RequestFilter";
import RequestTable from "../components/request/list/RequestTable";

const Request = () => {
  const {} = useStore();

  return (
    <Fragment>
      <RequestHeader />
      <Divider className="header-divider" />
      <RequestFilter />
      <RequestTable />
    </Fragment>
  );
};

export default Request;
