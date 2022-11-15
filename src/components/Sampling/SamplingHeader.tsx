import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { useStore } from "../../app/stores/store";

type UserHeaderProps = {
  handleList: () => void;
};
const { Text } = Typography;
const SampleHeader: FC<UserHeaderProps> = ({ handleList }) => {
  const { procedingStore, optionStore, locationStore, samplig } = useStore();

  const { getAll, studys, printTicket, update,soliCont,studyCont } = samplig;
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title={`Registrar Toma de Muestra`} image="tomaMuestra" />
      }
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{soliCont}</Text>
        </Text>,
        <Text key="number">
          Estudios:{" "}
          <Text strong>
            {studyCont}
          </Text>
        </Text>,
        ,
        <DownloadIcon key="doc" onClick={handleList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(SampleHeader);
