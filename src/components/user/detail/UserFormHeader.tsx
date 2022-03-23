import { PageHeader } from "antd";
import React from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";

const UserFormHeader = () => {
  let navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo usuarios" image="user" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" />,
        <ImageButton key="doc" title="Informe" image="doc" />,
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/users");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default UserFormHeader;
