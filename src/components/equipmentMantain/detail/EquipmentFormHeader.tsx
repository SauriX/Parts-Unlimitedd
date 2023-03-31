import { PageHeader, Input } from "antd";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
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
  const { equipmentMantainStore } = useStore();
  const { idEq } = equipmentMantainStore;

  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Mantenimiento de Equipo" image="equipo" />}
      className="header-container"
      extra={[
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
