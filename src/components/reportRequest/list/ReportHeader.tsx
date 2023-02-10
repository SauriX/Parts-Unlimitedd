import { Button, PageHeader,  Typography } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";


const { Text } = Typography;

const ReportHeader = () => {
  const { requestStore, modalStore } = useStore();
  const { requests } = requestStore;
  const { openModal } = modalStore;

  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle image="studyreport" title="Reporte de estudios del día" />}
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{requests.length}</Text>
        </Text>,
        <Text key="number">
          Estudios:{" "}
          <Text strong>{requests.flatMap((x) => x.estudios).length}</Text>
        </Text>,
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);
