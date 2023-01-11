import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import React from "react";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";

const { Text } = Typography;

type UserHeaderProps = {
  handleList: () => void;
};
const IndicatorModalHeader: FC<UserHeaderProps> = ({ handleList }) => {
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title={`Configuración de parámetros`} image="configuracion" />
      }
      className="header-container"
      extra={[<DownloadIcon key="doc" onClick={handleList} />]}
    ></PageHeader>
  );
};

export default observer(IndicatorModalHeader);
