import { PageHeader, Input } from "antd";
import { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";

const { Search } = Input;
type IndicationFormHeaderProps = {
  handlePrint: () => void;
  id: number;
};

const IndicationFormHeader: FC<IndicationFormHeaderProps> = ({
  id,
  handlePrint,
}) => {
  const { indicationStore } = useStore();
  const { exportForm } = indicationStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle title="Catálogo de Indicaciones" image="indicacion" />
      }
      className="header-container"
      extra={[
        id != 0 ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id != 0 ? <DownloadIcon key="doc" onClick={download} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate("/indications");
          }}
        />,
      ]}
    ></PageHeader>
  );
};

export default IndicationFormHeader;
