import { Divider } from "antd";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MedicsForm from "./MedicsForm";
import MedicsFormHeader from "./MedicsFormHeader";

type UrlParams = {
  id: string;
};

const MedicsDetail = () => {
  let navigate = useNavigate();

  const { id } = useParams<UrlParams>();
  const medicsId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  if (medicsId === undefined) {
    navigate("/notFound");
  }

  return (
    <Fragment>
      <MedicsFormHeader id={medicsId!} />
      <Divider className="header-divider" />
      <MedicsForm id={medicsId!} />
    </Fragment>
  );
};

export default MedicsDetail;