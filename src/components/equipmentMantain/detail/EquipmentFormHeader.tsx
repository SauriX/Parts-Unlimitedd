import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const { Search } = Input;
type EquipmentFormHeaderProps = {
  handlePrint: () => void;
  id: number;
};

const EquipmentFormHeader: FC<EquipmentFormHeaderProps> = ({
  id,
  handlePrint,
}) => {
  const { equipmentStore } = useStore();
  const { exportForm } = equipmentStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Configuración de Equipo" image="equipo" />}
      className="header-container"
      extra={[
        id != 0 ? (
          <ImageButton
            key="print"
            title="Imprimir"
            image="print"
            onClick={handlePrint}
          />
        ) : (
          ""
        ),
        id != 0 ? (
          <ImageButton
            key="doc"
            title="Informe"
            image="doc"
            onClick={download}
          />
        ) : (
          ""
        ),
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/equipment");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default EquipmentFormHeader;
