import { PageHeader, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Text } = Typography;

const ReagentHeader = () => {
  const { requestStore } = useStore();
  const { request } = requestStore;

  let navigate = useNavigate();

  const getBack = () => {
    navigate(`/${views.request}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Solicitud" />}
      className="header-container"
      extra={[
        <GoBackIcon key="back" onClick={getBack} />,
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
