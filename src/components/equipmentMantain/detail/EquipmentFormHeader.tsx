import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

const { Search } = Input;
type EquipmentFormHeaderProps = {
  handlePrint: () => void;
  id: number;
};

const EquipmentFormHeader: FC<EquipmentFormHeaderProps> = ({
  id,
  handlePrint,
}) => {
  const { equipmentStore, equipmentMantainStore } = useStore();
  const { exportForm, idEq } = equipmentMantainStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Mantenimiento de Equipo" image="equipo" />}
      className="header-container"
      extra={[
        id != 0 ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id != 0 ? <DownloadIcon key="doc" onClick={download} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate(`/equipmentMantain/${idEq}`);
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default EquipmentFormHeader;
