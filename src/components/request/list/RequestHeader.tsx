import { Button, PageHeader,  Typography } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import RequestWee from "./RequestWee";

const { Text } = Typography;

const RequestHeader = () => {
  const { requestStore, modalStore } = useStore();
  const { requests } = requestStore;
  const { openModal } = modalStore;

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
          Estudios:{" "}
          <Text strong>{requests.flatMap((x) => x.estudios).length}</Text>
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
        <Button
          key="wee"
          onClick={() => {
            openModal({
              title: "Crear solicitud WeeClinic",
              body: <RequestWee />,
              width: 900,
            });
          }}
          icon={<PlusOutlined />}
        >
          Nuevo WeeClinic
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default observer(RequestHeader);
