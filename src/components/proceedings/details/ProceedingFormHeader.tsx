import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

const { Search } = Input;

type ProceedingProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
  id: string;
};

const ProceedingFormHeader: FC<ProceedingProps> = ({
  handlePrint,
  handleDownload,
  id,
}) => {
  const { procedingStore } = useStore();
  const { clearTax } = procedingStore;
  console.log("el id de la promo");
  console.log(id);
  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    clearTax();
    navigate(`/${views.proceeding}?${searchParams}`);
  };
  /*  console.log(scopes); */
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="EXPEDIENTE" image="expediente" />}
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
            key="doc"
            onClick={handleDownload}
          />
        ),
        <GoBackIcon key="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default ProceedingFormHeader;
