import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

type CatalogFormHeaderProps = {
  id: number;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const CatalogFormHeader: FC<CatalogFormHeaderProps> = ({
  id,
  handlePrint,
  handleDownload,
}) => {
  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/catalogs?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo General" image="catalogo" />}
      className="header-container"
      extra={[
        !!id && <PrintIcon key="print" onClick={handlePrint} />,
        !!id && <DownloadIcon key="doc" onClick={handleDownload} />,
        <GoBackIcon key="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default CatalogFormHeader;
