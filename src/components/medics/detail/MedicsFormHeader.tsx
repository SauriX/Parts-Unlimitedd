import { PageHeader} from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

type MedicsFormHeaderProps = {
  handlePrint: () => void;
  id : string;
};

const MedicsFormHeader: FC<MedicsFormHeaderProps> = ({id, handlePrint }) => {
  const { medicsStore } = useStore();
  const { exportForm } = medicsStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  //const [searchParams, setSearchParams] = useSearchParams();

  //console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
      className="header-container"
      extra={[
        id? <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:"",
        id? <ImageButton key="doc" title="Informe" image="doc" onClick={download}  />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/medics");
          }}
        />,
        
      ]}
    ></PageHeader>
  );
};

export default MedicsFormHeader;
