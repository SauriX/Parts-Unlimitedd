import { PageHeader } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type UserHeaderProps = {
  handleList: () => void;
};
const SampleHeader: FC<UserHeaderProps> = ({ handleList }) => {
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title={`Registrar Toma de Muestra`} image="tomaMuestra" />
      }
      className="header-container"
      extra={[<DownloadIcon key="doc" onClick={handleList} />]}
    ></PageHeader>
  );
};

export default observer(SampleHeader);
