import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type CashHeaderProps = {
  handleDownload: () => Promise<void>;
};

const ReportHeader: FC<CashHeaderProps> = ({ handleDownload }) => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Corte de Caja" image="caja-registradora" />}
      className="header-container"
      extra={[
        <DownloadIcon key="download" onClick={handleDownload} />
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);
