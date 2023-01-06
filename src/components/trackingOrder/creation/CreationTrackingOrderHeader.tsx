import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { useStore } from "../../../app/stores/store";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

const { Search } = Input;

type CreationTrackingOrderHeaderProps = {
  handlePrint: () => void;
};

const CreationTrackingOrderHeader: FC<CreationTrackingOrderHeaderProps> = ({
  handlePrint,
}) => {
  const navigate = useNavigate();
  const { trackingOrderStore } = useStore();
  const { exportList, TranckingOrderSend, OrderId,clearTrackingOrders } = trackingOrderStore;

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
        <GoBackIcon
          key="back"
          onClick={() => {
            clearTrackingOrders()
            
            navigate(`/segRutas`);
          }}
        />,
    /*     <PrintIcon onClick={handlePrint} />, */
        <DownloadIcon onClick={download} />,
      ]}
    ></PageHeader>
  );
};

export default CreationTrackingOrderHeader;
