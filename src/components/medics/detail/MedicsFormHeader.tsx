import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

type MedicsFormHeaderProps = {
  handlePrint: () => void;
  id: string;
};

const MedicsFormHeader: FC<MedicsFormHeaderProps> = ({ id, handlePrint }) => {
  const { medicsStore } = useStore();
  const { exportForm } = medicsStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={download} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate("/medics");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default MedicsFormHeader;
