import { PageHeader } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ImageButton from "../../../app/common/button/ImageButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";

type PriceListFormHeaderProps = {
  id: string;
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const PriceListFormHeader: FC<PriceListFormHeaderProps> = ({ id, handlePrint, handleDownload }) => {
  const { priceListStore } = useStore();
  const { scopes } = priceListStore;

  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const getBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.price}?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Listas de Precios" image="ListaPrecio" />}
      className="header-container"
      extra={[
        
        !!id && scopes?.descargar && (
          scopes?.imprimir && <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
          <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />
        ),
        <ImageButton key="back" title="Regresar" image="back" onClick={getBack} />,
      ]}
    ></PageHeader>
  );
};

export default observer(PriceListFormHeader);
