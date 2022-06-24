import { Button, PageHeader, Input, Typography } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import views from "../../app/util/view";

const { Text } = Typography;
const { Search } = Input;

type ReagentHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const ReagentHeader: FC<ReagentHeaderProps> = ({ handlePrint, handleDownload }) => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Solicitud" />}
      className="header-container"
      extra={[
        <Text key="request">
          Solicitud: <Text strong>1223334445</Text>
        </Text>,
        <Text key="number">
          Registro: <Text strong>10:30 ARGO</Text>
        </Text>,
        // <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
        // <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
        // <Search key="search" placeholder="Buscar" />,
        // <Button key="new" type="primary" icon={<PlusOutlined />}>
        //   Nuevo
        // </Button>,
      ]}
    ></PageHeader>
  );
};

export default ReagentHeader;
