import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import React from "react";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

const { Text } = Typography;

type UserHeaderProps = {
  handleList: () => void;
};
const RequestedStudyHeader: FC<UserHeaderProps> = ({ handleList }) => {
  const { requestedStudyStore } = useStore();
  const { data } = requestedStudyStore;
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Solicitar Estudio`}
          image="sitio-web"
        />
      }
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{data.length <= 0 ? 0 : data.length}</Text>
        </Text>,
        <Text key="studies">
          Estudios: <Text strong>{data.flatMap((x) => x.estudios).length}</Text>
        </Text>,
        <DownloadIcon
          key="doc"
          onClick={handleList}
        />,
      ]}
    ></PageHeader>
  );
};

export default observer(RequestedStudyHeader);
