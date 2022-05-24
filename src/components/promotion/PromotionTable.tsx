import { Button, Divider, PageHeader, Spin, Table } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IReagentList } from "../../app/models/reagent";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import views from "../../app/util/view";
import { IPromotionList } from "../../app/models/promotion";
const promotions:IPromotionList[]=[
    {
        id:1,
        nombre:"test",
        clave:"test",
        periodo:"test",
        nombreListaPrecio:"test",
        activo:true
    },{
        id:2,
        nombre:"test1",
        clave:"test1",
        periodo:"test1",
        nombreListaPrecio:"test1",
        activo:true
    }];
type PromotionTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const PromotionTable: FC<PromotionTableProps> = ({ componentRef, printing }) => {
  const { promotionStore } = useStore();
   const {  getAll,promotionLists } = promotionStore; 

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  useEffect(() => {
    const readPromotions = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

     if (promotionLists.length === 0) {
       readPromotions()
    } 
     
  }, [getAll]);

  const columns: IColumns<IPromotionList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, promotion) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.promo}/${promotion.id}?${searchParams}&mode=readonly`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre promocion", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("periodo", "Periodo", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
        ...getDefaultColumnProps("nombreListaPrecio", "Nombre Lista", {
          searchState,
          setSearchState,
          width: "15%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar promoción"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.promo}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const ReagentTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Promociones en listas de precios" image="promo" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IPromotionList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 4)}
          pagination={false}
          dataSource={[...promotions]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IPromotionList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...promotionLists]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<ReagentTablePrint />}</div>
    </Fragment>
  );
};

export default observer(PromotionTable);
