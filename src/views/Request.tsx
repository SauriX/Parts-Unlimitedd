import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import RequestHeader from "../components/request/list/RequestHeader";
import RequestFilter from "../components/request/list/RequestFilter";
import RequestTable from "../components/request/list/RequestTable";

const Request = () => {
  const {} = useStore();

  const [loading, setLoading] = useState(false);

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
