import { PageHeader } from "antd";
import React, { FC, useEffect } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate,useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
type UserFormHeaderProps = {
  handlePrint: () => void;
  handleDownload:()=>void;
};
const UserFormHeader: FC<UserFormHeaderProps> = ({ handlePrint,handleDownload }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo usuarios" image="user" />}
      className="header-container"
      extra={[
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        <ImageButton key="doc" title="Informe" image="doc"  onClick={handleDownload}/>,
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
