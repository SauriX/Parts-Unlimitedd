import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type MassSearchHeaderProps = {
  handleDownload: () => void;
};

const MassSearchHeader: FC<MassSearchHeaderProps> = ({ handleDownload }) => {
  return (
    <>
      <PageHeader
        ghost={false}
        title={
          <HeaderTitle
            title={`Tablas de captura de resultados`}
            image="massSearch"
          />
        }
        className="header-container"
        extra={[<DownloadIcon key="doc" onClick={handleDownload} />]}
      />
    </>
  );
};

export default observer(MassSearchHeader);
