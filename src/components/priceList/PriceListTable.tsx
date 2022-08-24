import { Button, Divider, PageHeader, Table } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
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
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import views from "../../app/util/view";
import { IPriceListList } from "../../app/models/priceList";

type PriceListTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const PriceListTable: FC<PriceListTableProps> = ({ componentRef, printing }) => {
  const { priceListStore } = useStore();
  const { priceLists, getAll } = priceListStore;

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
    const readPriceList = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    if (priceLists.length === 0) {
        readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IPriceListList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, priceList) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.price}/${priceList.id}?${searchParams}&mode=readonly`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "20%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "20%",
      render: (value) => (
        <IconButton
          title="Editar lista de precio"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.price}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const PriceListTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Lista de Precios" image="precio" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IPriceListList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 3)}
          pagination={false}
          dataSource={[...priceLists]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IPriceListList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...priceLists]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<PriceListTablePrint />}</div>
    </Fragment>
  );
};

export default observer(PriceListTable);
