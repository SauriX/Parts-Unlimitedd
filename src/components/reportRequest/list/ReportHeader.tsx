import { PageHeader, Typography } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import { FC } from "react";
import ImageButton from "../../../app/common/button/ImageButton";

type HeaderProps = {
  handleDownload: () => Promise<void>;
  handleDownloadList: () => Promise<void>;
};
const { Text } = Typography;

const ReportHeader: FC<HeaderProps> = ({
  handleDownload,
  handleDownloadList,
}) => {
  const { reportStudyStore } = useStore();
  const { requests } = reportStudyStore;

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle image="studyreport" title="Reporte de estudios del día" />
      }
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{requests.length}</Text>
        </Text>,
        <Text key="number">
          Estudios:{" "}
          <Text strong>{requests.flatMap((x) => x.estudios).length}</Text>
        </Text>,
        <DownloadIcon key="doc" onClick={handleDownload} />,
        <ImageButton image="archivo-excel" onClick={handleDownloadList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);
