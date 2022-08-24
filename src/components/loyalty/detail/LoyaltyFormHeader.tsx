import { PageHeader} from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

// const { Search } = Input;
type LoyaltyFormHeaderProps = {
    id: string;
    handlePrint: () => void;
    handleDownload: () => Promise<void>;
  };

const LoyaltyFormHeader: FC<LoyaltyFormHeaderProps> = ({id, handlePrint }) => {
  const { loyaltyStore } = useStore();
  const { exportForm } = loyaltyStore;

  const navigate = useNavigate();

  const download = () => {
    exportForm(id);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  //console.log("Header");

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Lealtades" image="lealtad" />}
      className="header-container"
      extra={[
        id? <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />:'',
        id? <ImageButton key="doc" title="Informe" image="doc" onClick={download}  />:'',
        <ImageButton
          key="back"
          title="Regresar"
          image="back"
          onClick={() => {
            navigate(`/${views.loyalty}?${searchParams}`);
          }}
        />,
        
      ]}
    ></PageHeader>
  );
};

export default LoyaltyFormHeader;
