import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";
import GoBackIcon from "../../app/common/icons/GoBackIcon";

const { Search } = Input;

type EquipmentHeaderProps = {
  handlePrint: () => void;
};
type UrlParams = {
  id: string;
};
const EquipmentMantainHeader: FC<EquipmentHeaderProps> = ({ handlePrint }) => {
  const navigate = useNavigate();
  const { equipmentStore } = useStore();
  const { exportList } = equipmentStore;

  const { id } = useParams<UrlParams>();
  const equipmentId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Mantenimiento de Equipo" image="equipo" />}
      className="header-container"
      extra={[
/*         <PrintIcon key="print" onClick={handlePrint} />,

        <DownloadIcon key="doc" onClick={download} />,
 */        <GoBackIcon
 key="back"
 onClick={() => {
   navigate(`/equipment`);
 }}
/>,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/equipmentMantain/new/${equipmentId}`);
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
