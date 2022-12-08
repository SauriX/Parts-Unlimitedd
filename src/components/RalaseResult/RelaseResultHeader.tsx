import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { useStore } from "../../app/stores/store";

type RelaseResultHeaderProps = {
  handleList: () => void;
};
const { Text } = Typography;
const RelaseResultHeader: FC<RelaseResultHeaderProps> = ({
  handleList,
}) => {
  const { procedingStore, optionStore, locationStore, resultValidationStore,relaseResultStore } = useStore();

  const { getAll, studys, printTicket, update,soliCont,studyCont } =  relaseResultStore;
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Liberación de resultados (Clínicos)`}
          image="validacion"
        />
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

export default observer(RelaseResultHeader);
