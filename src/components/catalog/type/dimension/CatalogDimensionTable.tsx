import { Button, PageHeader, Divider, Table } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
  defaultPaginationProperties,
} from "../../../../app/common/table/utils";
import { ICatalogList } from "../../../../app/models/catalog";
import IconButton from "../../../../app/common/button/IconButton";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";

const catalogName = "dimension";

type CatalogDimensionTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogDimensionTable: FC<CatalogDimensionTableProps> = ({ componentRef, printing }) => {
  const { catalogStore } = useStore();
  const { catalogs, getAll } = catalogStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  // useEffect(() => {
  //   const readCatalogs = async () => {
  //     setLoading(true);
  //     await getAll(catalogName, searchParams.get("search") ?? "all");
  //     setLoading(false);
  //   };

  //   readCatalogs();
  // }, [getAll, searchParams]);

  const columns: IColumns<ICatalogList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, catalog) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/catalogs/${catalog.id}?${searchParams}&mode=readonly`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("largo", "Largo", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("ancho", "Ancho", {
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
          title="Editar dimensión"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/catalogs/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const CatalogTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo General" image="catalogo" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<ICatalogList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 4)}
          pagination={false}
          dataSource={[...catalogs]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<ICatalogList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...catalogs]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<CatalogTablePrint />}</div>
    </Fragment>
  );
};

export default observer(CatalogDimensionTable);
