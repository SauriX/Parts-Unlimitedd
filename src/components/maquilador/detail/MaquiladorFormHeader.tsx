import {PageHeader} from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate} from "react-router-dom";
import { useStore } from "../../../app/stores/store";

// const { Search } = Input;
type MaquiladorFormHeaderProps = {
  handlePrint: () => void;
  id : number;
};

const MaquiladorFormHeader: FC<MaquiladorFormHeaderProps> = ({id, handlePrint }) => {
  const { maquiladorStore } = useStore();
  const { exportForm } = maquiladorStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  // const [searchParams, setSearchParams] = useSearchParams();

  //console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Maquilador" image="maquilador" />}
      className="header-container"
      extra={[
        id !=0 ?
        <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:"",
        id !=0 ?
        <ImageButton key="doc" title="Informe" image="doc" onClick={download}  />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate("/maquila");
          }}
        />,
        
      ]}
    ></PageHeader>
  );
};

export default MaquiladorFormHeader;