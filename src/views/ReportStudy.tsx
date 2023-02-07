import { Divider } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReportHeader from "../components/reportstudy/list/ReportHeader";
import ReportFilter from "../components/reportstudy/list/ReportFilter";
import ReportTable from "../components/reportstudy/list/ReportTable";

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
