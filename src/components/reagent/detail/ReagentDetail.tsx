import { Divider } from "antd";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReagentForm from "./ReagentForm";
import ReagentFormHeader from "./ReagentFormHeader";

type UrlParams = {
  id: string;
};

const ReagentDetail = () => {
  let navigate = useNavigate();

  const { id } = useParams<UrlParams>();
  const reagentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  if (reagentId === undefined) {
    navigate("/notFound");
  }

  return (
    <Fragment>
      <ReagentFormHeader id={reagentId!} />
      <Divider className="header-divider" />
      <ReagentForm id={reagentId!} />
    </Fragment>
  );
};

export default ReagentDetail;
