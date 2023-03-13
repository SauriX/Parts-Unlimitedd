import { Switch, Table } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";
import {
    defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ITagTrackingOrder } from "../../../app/models/routeTracking";
import { IStudyTrackList } from "../../../app/models/trackingOrder";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";

type TrackingOrderTableProps = {
  id?: string;
  loading: boolean;
  data: ITagTrackingOrder[];
};

const RouteTrackingCreateTable = ({ id, data, loading }: TrackingOrderTableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const { width: windowWidth } = useWindowDimensions();

  const columns: IColumns<ITagTrackingOrder> = [
    {
      ...getDefaultColumnProps("claveEtiqueta", "Clave muestra", {
        searchState,
        setSearchState,
        width: "15%",
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
        width: "25%",
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
      ...getDefaultColumnProps("ruta", "Clave ruta", {
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
    },
    {
      ...getDefaultColumnProps("escaneo", "Escaneo", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            onChange={(checked) => {
              record.escaneo = checked;
            }}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <Table<ITagTrackingOrder>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[...data]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(RouteTrackingCreateTable);
