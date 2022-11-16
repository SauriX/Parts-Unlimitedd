import { PageHeader, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Text } = Typography;

const RequestHeader = () => {
  const { requestStore } = useStore();
  const { request } = requestStore;

  let navigate = useNavigate();

  const getBack = () => {
    navigate(`/${views.request}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          image={request?.esWeeClinic ? "weeclinic" : undefined}
          folder="logos"
          title="Solicitud"
        />
      }
      onBack={getBack}
      className="header-container"
      extra={[
        request?.esWeeClinic && (
          <Text key="weeclinic">
            Folio Wee: <Text strong>{request?.folioWeeClinic}</Text>
          </Text>
        ),
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

export default observer(RequestHeader);
