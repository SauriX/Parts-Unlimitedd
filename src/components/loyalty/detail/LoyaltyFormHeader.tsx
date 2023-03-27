import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

// const { Search } = Input;
type LoyaltyFormHeaderProps = {
  id: string;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const LoyaltyFormHeader: FC<LoyaltyFormHeaderProps> = ({ id, handlePrint }) => {
  const { loyaltyStore } = useStore();
  const { exportForm } = loyaltyStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams] = useSearchParams();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Lealtades" image="lealtad" />}
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={download} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate(`/${views.loyalty}?${searchParams}`);
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default LoyaltyFormHeader;
