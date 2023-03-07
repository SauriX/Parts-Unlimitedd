import { Button, PageHeader, Typography } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
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
  const { reportStudyStore, modalStore } = useStore();
  const { requests } = reportStudyStore;
  const { openModal } = modalStore;

  const navigate = useNavigate();

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
        <ImageButton image="archivo-excel"  onClick={handleDownload} />,
        <DownloadIcon key="doc" onClick={handleDownloadList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);
 