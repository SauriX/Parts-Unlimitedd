import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReportHeader from "../components/reportRequest/list/ReportHeader";
import ReportFilter from "../components/reportRequest/list/ReportFilter";
import ReportTable from "../components/reportRequest/list/ReportTable";

const ReportStudy = () => {
  const {} = useStore();

  const [loading, setLoading] = useState(false);

  return (
    <Fragment>
      <ReportHeader />
      <Divider className="header-divider" />
      <ReportFilter />
      <ReportTable />
    </Fragment>
  );
};

export default ReportStudy;
