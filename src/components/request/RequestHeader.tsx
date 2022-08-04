import { PageHeader, Typography } from "antd";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { useStore } from "../../app/stores/store";

const { Text } = Typography;

const ReagentHeader = () => {
  const { requestStore } = useStore();
  const { request } = requestStore;

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Solicitud" />}
      className="header-container"
      extra={[
        <Text key="request">
          Solicitud: <Text strong>{request?.clave}</Text>
        </Text>,
        <Text key="number">
          Registro: <Text strong>{request?.registro}</Text>
        </Text>,
      ]}
    ></PageHeader>
  );
};

export default observer(ReagentHeader);
