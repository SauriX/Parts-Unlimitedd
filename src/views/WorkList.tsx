import { Divider } from "antd";
import React, { Fragment } from "react";
import WorkListFilter from "../components/workList/WorkListFilter";
import WorkListHeader from "../components/workList/WorkListHeader";
import WorkListPdf from "../components/workList/WorkListPdf";

const WorkList = () => {
  return (
    <Fragment>
      <WorkListHeader />
      <Divider className="header-divider" />
      <WorkListFilter />
      <WorkListPdf />
    </Fragment>
  );
};

export default WorkList;
