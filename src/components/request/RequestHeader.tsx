import { PageHeader, Typography } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";

const { Text } = Typography;

const ReagentHeader = () => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Solicitud" />}
      className="header-container"
      extra={[
        <Text key="request">
          Solicitud: <Text strong>1223334445</Text>
        </Text>,
        <Text key="number">
          Registro: <Text strong>10:30 ARGO</Text>
        </Text>,
      ]}
    ></PageHeader>
  );
};

export default ReagentHeader;
