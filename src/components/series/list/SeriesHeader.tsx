import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";

type SeriesHeaderProps = {
  handleList: () => void;
};

const SeriesHeader: FC<SeriesHeaderProps> = ({ handleList }) => {
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Catálogo de series de facturas y recibos`}
          image="sello"
        />
      }
      className="header-container"
      extra={[<DownloadIcon key="doc" onClick={handleList} />]}
    ></PageHeader>
  );
};

export default observer(SeriesHeader);
