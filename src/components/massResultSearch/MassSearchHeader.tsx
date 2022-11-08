import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

type UserHeaderProps = {
  handleDownload: () => void;
};

const MassSearchHeader: FC<UserHeaderProps> = ({ handleDownload }) => {
  return (
    <>
      <PageHeader
        ghost={false}
        title={
          <HeaderTitle
            title={`Búsqueda de captura de resultados masiva`}
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
