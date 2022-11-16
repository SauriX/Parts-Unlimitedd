import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import views from "../../../app/util/view";

const QuotationHeader = () => {
  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Cotizaciones" />}
      className="header-container"
      extra={[
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/${views.quotation}/new`);
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default QuotationHeader;
