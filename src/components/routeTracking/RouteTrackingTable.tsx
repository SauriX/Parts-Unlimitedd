import { Button, Divider, PageHeader, Table, Tabs } from "antd";
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
import PendingSend from "./TapsComponents/PendingSend";
import PendingRecive from "./TapsComponents/PendingRecive";

type RouteTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const RouteTrackingTable: FC<RouteTableProps> = ({
  componentRef,
  printing,
}) => {
  const { TabPane } = Tabs;
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
      // create(routes).then(x => { getAll("all")});
    };

    readRoutes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IRouteList> = [
    {
      ...getDefaultColumnProps("clave", "Claves", {
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
            navigate(
              `/${views.route}/${route.id}?${searchParams}&mode=readonly`
            );
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
          title="Editar ruta"
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
          title={<HeaderTitle title="Catálogo de Rutas" image="ruta" />}
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="Pendientes de enviar" key="1">
          <PendingSend></PendingSend>
        </TabPane>
        <TabPane tab="Pendientes de recibir" key="2">
          <PendingRecive></PendingRecive>
        </TabPane>
        <TabPane tab="Reporte" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default observer(RouteTrackingTable);
