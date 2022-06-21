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
import { IRouteList } from "../../app/models/route";

type RouteTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const RouteTable: FC<RouteTableProps> = ({ componentRef, printing }) => {
    const { routeStore } = useStore();
  const { routes, getAll } = routeStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  //console.log("Table");

  useEffect(() => {
    const readRoutes = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
      getAll("all");
      // create(routes).then(x => { getAll("all")});
    };

    if (routes.length === 0) {
      readRoutes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IRouteList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, route) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.route}/${route.id}?${searchParams}&mode=readonly`);
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
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("sucursalOrigen", "Sucursal Origen", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
        ...getDefaultColumnProps("sucursalDestino", "Destino", {
          searchState,
          setSearchState,
          width: "20%",
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
          title="Editar reactivo"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.route}/${value}?${searchParams}&mode=edit`);
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
          title={<HeaderTitle title="Catálogo de Rutas" image="rutas" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IRouteList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 5)}
          pagination={false}
          dataSource={[...routes]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IRouteList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...routes]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<ReagentTablePrint />}</div>
    </Fragment>
  );
};

export default observer(RouteTable);