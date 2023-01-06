import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type IndicatorHeaderProps = {
  handleDownload: () => Promise<void>;
};

const ReportHeader: FC<IndicatorHeaderProps> = ({ handleDownload }) => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Reporte Indicadores" image="indicadores" />}
      className="header-container"
      extra={[
        <DownloadIcon key="download" onClick={handleDownload} />
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);