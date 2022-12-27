import { PageHeader } from "antd";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

type PriceListFormHeaderProps = {
  id: string;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const PriceListFormHeader: FC<PriceListFormHeaderProps> = ({
  id,
  handlePrint,
  handleDownload,
}) => {
  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.price}?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title="Catálogo de Listas de Precios" image="precio" />
      }
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={handleDownload} /> : "",
        <GoBackIcon key="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default observer(PriceListFormHeader);
