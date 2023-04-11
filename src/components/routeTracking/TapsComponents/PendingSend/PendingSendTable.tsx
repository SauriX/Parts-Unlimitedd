import { Button, Table } from "antd";
import React, { useState } from "react";
import { IRouteTrackingList } from "../../../../app/models/routeTracking";
import { useStore } from "../../../../app/stores/store";
import {
  IColumns,
  ISearch,
  defaultPaginationProperties,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import { studyStatus } from "../../../../app/util/catalogs";

const PendingSendTable = () => {
  const { routeTrackingStore } = useStore();
  const { studyTags, loadingRoutes } = routeTrackingStore;

  let navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IRouteTrackingList> = [
    {
      ...getDefaultColumnProps("seguimiento", "No. seguimiento", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
      }),
      render: (value, route) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/ShipmentTracking/${route.id}`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("claveEtiqueta", "Clave muestra", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("recipiente", "Recipiente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("ruta", "Clave de Ruta", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value) => {
        return studyStatus(value);
      },
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de entrega", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (value, route) =>
        route.seguimiento && (
          <IconButton
            title="Editar ruta"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/trackingOrder/${value}`);
            }}
          />
        ),
    },
  ];

  return (
    <Table<IRouteTrackingList>
      loading={loadingRoutes}
      size="small"
      rowKey={uuid()}
      columns={columns}
      dataSource={[...studyTags]}
      pagination={defaultPaginationProperties}
      bordered
    ></Table>
  );
};

export default observer(PendingSendTable);
