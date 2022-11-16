import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { FC } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import React from "react";

type DeliveryResultsHeaderProps = {
  handleDownload: () => void;
  handlePrint: () => void;
};
const DeliveryResultsHeader: FC<DeliveryResultsHeaderProps> = ({
  handleDownload,
  handlePrint,
}) => {
  return (
    <>
      <PageHeader
        ghost={false}
        title={
          <HeaderTitle
            title="Busqueda de captura de resultados"
            image="massSearch"
          />
        }
        className="header-container"
        extra={[
          <DownloadIcon key="doc" onClick={handleDownload} />,
          <PrintIcon key="print" onClick={handlePrint} />,
        ]}
      />
    </>
  );
};
export default observer(DeliveryResultsHeader);
