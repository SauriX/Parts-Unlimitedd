import { PageHeader, Typography } from "antd";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { FC } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import React from "react";
import { useStore } from "../../app/stores/store";

const { Text } = Typography;

type DeliveryResultsHeaderProps = {
  handleDownload: () => void;
  handlePrint: () => void;
};
const DeliveryResultsHeader: FC<DeliveryResultsHeaderProps> = ({
  handleDownload,
  handlePrint,
}) => {
  const { massResultSearchStore } = useStore();
  const { requests } = massResultSearchStore;
  return (
    <>
      <PageHeader
        ghost={false}
        title={<HeaderTitle title="Envío de resultados" image="enviar-datos" />}
        className="header-container"
        extra={[
          <Text key="request">
            Solicitudes: <Text strong>{requests.length}</Text>
          </Text>,
          <Text key="studies">
            Estudios:{" "}
            <Text strong>
              {requests.reduce(
                (acc, element) => acc + element?.estudios.length,
                0
              )}
            </Text>
          </Text>,
          <DownloadIcon key="doc" onClick={handleDownload} />,
          // <PrintIcon key="print" onClick={handlePrint} />,
        ]}
      />
    </>
  );
};
export default observer(DeliveryResultsHeader);
