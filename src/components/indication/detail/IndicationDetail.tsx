import { Divider } from "antd";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IndicationForm from "./IndicationForm";
import IndicationFormHeader from "./IndicationFormHeader";

type UrlParams = {
  id: string;
};

const IndicationDetail = () => {
  let navigate = useNavigate();

  const { id } = useParams<UrlParams>();
  const indicationId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  if (indicationId === undefined) {
    navigate("/notFound");
  }

  return (
    <Fragment>
      <IndicationFormHeader id={indicationId!} />
      <Divider className="header-divider" />
      <IndicationForm id={indicationId!} />
    </Fragment>
  );
};

export default IndicationDetail;