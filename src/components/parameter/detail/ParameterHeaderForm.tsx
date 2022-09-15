import { PageHeader } from "antd";
import React, { FC, useEffect } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
type ParameterFormHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => void;
};
type UrlParams = {
  id: string;
};
const ParameterFormHeader: FC<ParameterFormHeaderProps> = ({
  handlePrint,
  handleDownload,
}) => {
  let { id } = useParams<UrlParams>();
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Parámetros" image="parametro" />}
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={handleDownload} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate("/parameters");
          }}
        />,
      ]}
    ></PageHeader>
  );
};
export default ParameterFormHeader;
