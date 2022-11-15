import { PageHeader, Typography } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type UserHeaderProps = {
  handleList: () => void;
};
const { Text } = Typography;
const SampleHeader: FC<UserHeaderProps> = ({ handleList }) => {
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title={`Registrar Toma de Muestra`} image="tomaMuestra" />
      }
      className="header-container"
      extra={[
        <Text key="request">
          Solicitudes: <Text strong>{/* requests.length */ 4}</Text>
        </Text>,
        <Text key="number">
          Estudios:{" "}
          <Text strong>
            {/* requests.flatMap((x) => x.estudios).length */ 4}
          </Text>
        </Text>,
        ,
        <DownloadIcon key="doc" onClick={handleList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(SampleHeader);
