import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

const { Search } = Input;

type QuotationHeaderFormProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  id: string;
};

const QuotationHeaderForm: FC<QuotationHeaderFormProps> = ({
  handlePrint,
  handleDownload,
  id,
}) => {
  const { quotationStore } = useStore();
  const { /* scopes, */ getQuotations: getAll, exportList } = quotationStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;

    /*   await getAll(search ?? "all"); */

    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };
  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.quotatiion}?${searchParams}`);
  };
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Cotizaciones" />}
      className="header-container"
      extra={[
        id && (
          /* scopes?.imprimir && */ <PrintIcon
            key="print"
            onClick={handlePrint}
          />
        ),
        id && (
          /* scopes?.descargar */ /*  && */ <DownloadIcon
            key="download"
            onClick={handleDownload}
          />
        ),
        <GoBackIcon key="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default QuotationHeaderForm;
