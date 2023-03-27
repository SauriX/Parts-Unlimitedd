import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

// const { Search } = Input;
type MaquiladorFormHeaderProps = {
  handlePrint: () => void;
  id: number;
};

const MaquiladorFormHeader: FC<MaquiladorFormHeaderProps> = ({
  id,
  handlePrint,
}) => {
  const { maquiladorStore } = useStore();
  const { exportForm } = maquiladorStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Maquilador" image="maquilador" />}
      className="header-container"
      extra={[
        id != 0 ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id != 0 ? <DownloadIcon key="doc" onClick={download} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate("/maquila");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default MaquiladorFormHeader;
