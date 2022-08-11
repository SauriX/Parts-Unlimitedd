import { Button, PageHeader, Input, Typography } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Search } = Input;
const { Text } = Typography;

const RequestHeader = () => {
  const { requestStore } = useStore();
  const { requests } = requestStore;

  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Estatus de solicitudes" />}
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{requests.length}</Text>
        </Text>,
        <Text key="number">
          Estudios: <Text strong>{requests.flatMap((x) => x.estudios).length}</Text>
        </Text>,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/${views.proceeding}`);
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default observer(RequestHeader);
