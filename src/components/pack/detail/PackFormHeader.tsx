import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

type BranchFormHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => void;
};
type UrlParams = {
  id: string;
};
const PackFormHeader: FC<BranchFormHeaderProps> = ({
  handlePrint,
  handleDownload,
}) => {
  let { id } = useParams<UrlParams>();
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={handleDownload} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate(`/${views.pack}`);
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default PackFormHeader;
