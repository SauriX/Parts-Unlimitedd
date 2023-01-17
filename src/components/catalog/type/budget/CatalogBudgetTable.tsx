import { Button, Divider, PageHeader, Table } from "antd";
import React, { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../../../app/common/button/IconButton";
import {
    defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { ICatalogList } from "../../../../app/models/catalog";
import { useStore } from "../../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import moment from "moment";
import { observer } from "mobx-react-lite";

type CatalogBudgetTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogBudgetTable: FC<CatalogBudgetTableProps> = ({
  componentRef,
  printing,
}) => {
  const { catalogStore } = useStore();
  const { catalogs } = catalogStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ICatalogList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
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
      ...getDefaultColumnProps("nombre", "Servicio", {
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
      key: "fechaAlta",
      dataIndex: "fechaAlta",
      title: "Fecha de Alta",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "15%",
      render: (value) => (moment(value).format("DD/MM/YYYY")),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title={"Editar servicio"}
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
        <Table<any>
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

export default observer(CatalogBudgetTable);
