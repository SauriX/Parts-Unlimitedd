import { Divider } from "antd";
import { Fragment } from "react";
import RequestHeader from "../components/request/RequestHeader";
import RequestRecord from "../components/request/RequestRecord";
import RequestTab from "../components/request/RequestTab";
import "../components/request/css/index.less";
import { useParams } from "react-router-dom";

const Request = () => {
  const { recordId } = useParams();

  if (!recordId) return null;

  return (
    <Fragment>
      <RequestHeader />
      <Divider className="header-divider" />
      <RequestRecord recordId={recordId} />
      <RequestTab recordId={recordId} />
    </Fragment>
  );
};

export default Request;
