import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { useStore } from "../../../app/stores/store";

const { Search } = Input;

type CreationTrackingOrderHeaderProps = {
  handlePrint: () => void;
};

const CreationTrackingOrderHeader: FC<CreationTrackingOrderHeaderProps> = ({
  handlePrint,
}) => {
  const navigate = useNavigate();
  const { trackingOrderStore } = useStore();
  const { exportList, TranckingOrderSend, OrderId } = trackingOrderStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const download = () => {
    exportList();
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title="Creación de orden de seguimiento"
          image="ordenseguimiento"
        />
      }
      className="header-container"
      extra={[
        <ImageButton
          key="print"
          title="Imprimir"
          image="print"
          onClick={handlePrint}
        />,
        <ImageButton
          key="doc"
          title="Informe"
          image="doc"
          onClick={download}
        />,
      ]}
    ></PageHeader>
  );
};

export default CreationTrackingOrderHeader;
