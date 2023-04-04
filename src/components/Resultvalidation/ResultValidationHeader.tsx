import { PageHeader, Switch, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { useStore } from "../../app/stores/store";

type ResultValidationHeaderProps = {
  handleList: () => void;
};
const { Text } = Typography;

const ResultValidationHeader: FC<ResultValidationHeaderProps> = ({
  handleList,
}) => {
  const { relaseResultStore, resultValidationStore } = useStore();
  const { soliCont, studyCont } = resultValidationStore;
  const { setActiveTab } = relaseResultStore;
  const [active, setActive] = useState(false);

  const onChangeActive = () => {
    console.log("here2c");
    setActive(true);
  };

  useEffect(() => {
    console.log("here2");
    setActiveTab(active);
  }, [active]);

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Validación de resultados (Clínicos)`}
          image="validacion"
        />
      }
      className="header-container"
      extra={[
        <Switch
          checkedChildren="Validación"
          unCheckedChildren="Liberación"
          checked={false}
          onChange={() => onChangeActive()}
        />,
        <Text key="request">
          Solicitudes: <Text strong>{soliCont}</Text>
        </Text>,
        <Text key="number">
          Estudios: <Text strong>{studyCont}</Text>
        </Text>,
        ,
        <DownloadIcon key="doc" onClick={handleList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(ResultValidationHeader);
