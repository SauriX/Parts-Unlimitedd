import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

const { Text } = Typography;

type UserHeaderProps = {
  handleList: () => void;
};
const RequestedStudyHeader: FC<UserHeaderProps> = ({ handleList }) => {
  const { requestedStudyStore } = useStore();
  const { data } = requestedStudyStore;
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Registrar Solicitud de Estudio`}
          image="sitio-web"
        />
      }
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{data.length <= 0 ? 0 : data.length}</Text>
        </Text>,
        <Text key="studies">
          Estudios: <Text strong>{data.flatMap((x) => x.estudios).length}</Text>
        </Text>,
        <ImageButton
          key="doc"
          title="Informe"
          image="doc"
          onClick={handleList}
        />,
      ]}
    ></PageHeader>
  );
};

export default observer(RequestedStudyHeader);
