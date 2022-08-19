import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";

const { Search } = Input;

type EquipmentHeaderProps = {
  handlePrint: () => void;
};

const EquipmentMantainHeader: FC<EquipmentHeaderProps> = ({ handlePrint }) => {
  const navigate = useNavigate();
  const { equipmentStore } = useStore();
  const { exportList } = equipmentStore;

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  const download = () => {
    exportList(searchParams.get("search") ?? "all");
  };

  console.log("Header");
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Mantenimiento de Equipo" image="equipo" />}
      className="header-container"
      extra={[
        <ImageButton
          key="print"
          title="Imprimir"
          image="print"
          onClick={handlePrint}
        />,
        <ImageButton
          key="doc"
          title="Informe"
          image="doc"
          onClick={download}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("/equipment/0");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default EquipmentMantainHeader;
