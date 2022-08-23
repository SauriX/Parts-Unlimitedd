import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import views from "../../app/util/view";

const { Search } = Input;

type PromotionHeaderProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const PromotionHeader: FC<PromotionHeaderProps> = ({ handlePrint, handleDownload }) => {
  const { promotionStore } = useStore();
   const { scopes, getAll, exportList } = promotionStore; 

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;

     await getAll(search ?? "all"); 

    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Promociones en listas de precios​" image="promocion" />}
      className="header-container"
      extra={[
         scopes?.imprimir &&  <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
         scopes?.descargar &&  <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
        <Search
          key="search"
          placeholder="Buscar"
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={search}
        />,
         scopes?.crear &&  (
          <Button
            key="new"
            type="primary"
            onClick={() => {
              navigate(`/${views.promo}/new?${searchParams}&mode=edit`);
            }}
            icon={<PlusOutlined />}
          >
            Nuevo
          </Button>
        ),
      ]}
    ></PageHeader>
  );
};

export default PromotionHeader;
