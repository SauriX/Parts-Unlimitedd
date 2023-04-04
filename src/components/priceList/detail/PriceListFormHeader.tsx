import { PageHeader, Pagination } from "antd";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { useStore } from "../../../app/stores/store";

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
  const { priceListStore } = useStore();
  const { priceLists } = priceListStore;

  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getPage = (recordId?: string) => {
    return priceLists.findIndex((x) => x.id === recordId) + 1;
  };

  const setPage = (page: number) => {
    const priceList = priceLists[page - 1];
    navigate(`/${views.price}/${priceList.id}`);
  };

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
      subTitle={
        <Pagination
          size="small"
          total={priceLists.length}
          pageSize={1}
          current={getPage(id)}
          onChange={setPage}
          showSizeChanger={false}
        />
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
