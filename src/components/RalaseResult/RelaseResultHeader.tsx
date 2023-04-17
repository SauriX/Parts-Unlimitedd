import { PageHeader, Switch, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { useStore } from "../../app/stores/store";

type RelaseResultHeaderProps = {
  handleList: () => void;
};
const { Text } = Typography;
const RelaseResultHeader: FC<RelaseResultHeaderProps> = ({ handleList }) => {
  const { relaseResultStore } = useStore();
  const { soliCont, studyCont, setActiveTab, activeTab } = relaseResultStore;
  const [active, setActive] = useState(true);

  const onChangeActive = () => {
    setActive(false);
  };

  useEffect(() => {
    setActiveTab(active);
  }, [active]);

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
        <Switch
          checkedChildren="Liberación"
          unCheckedChildren="Validación"
          checked={true}
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

export default observer(RelaseResultHeader);
