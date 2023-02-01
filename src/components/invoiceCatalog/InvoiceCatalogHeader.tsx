import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";
import views from "../../app/util/view";
type InvoiceCatalogProps = {
  handleDownload: () => Promise<void>;
};
const InvoiceCatalogHeader: FC<InvoiceCatalogProps>  = ({handleDownload}) => {
  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de facturas y recibos" image="facturas" />}
      className="header-container"
      extra={[
        /* scopes?.descargar && */ <DownloadIcon
        key="doc"
        onClick={handleDownload}
      />,
      ]}
    ></PageHeader>
  );
};

export default InvoiceCatalogHeader;
