import { Button, Table, Typography } from "antd";
import React, { Fragment, useState } from "react";
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

const { Text } = Typography;

const PendingSendTable = () => {
  const { routeTrackingStore } = useStore();
  const { sendStudyTags: studyTags, loadingRoutes } = routeTrackingStore;

  let navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const renderExtra = (
    value: any,
    record: IRouteTrackingList,
    isKey?: boolean
  ) => {
    if (record.extra && isKey) {
      return (
        <Text style={{ color: "#253B65" }} strong>
          {value + "(E)"}
        </Text>
      );
    } else if (record.extra) {
      return (
        <Text style={{ color: "#253B65" }} strong>
          {value}
        </Text>
      );
    } else {
      return <Text>{value}</Text>;
    }
  };

  const columns: IColumns<IRouteTrackingList> = [
    {
      ...getDefaultColumnProps("seguimiento", "No. seguimiento", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
      }),
      render: (value, record) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/ShipmentTracking/${record.id}`);
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
      render: (value, record) => renderExtra(value, record, true),
    },
    {
      ...getDefaultColumnProps("recipiente", "Recipiente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(value, record),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(value, record),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(value, record),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(value, record),
    },
    {
      ...getDefaultColumnProps("ruta", "Clave de ruta", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value: string, record) => {
        let route = value.split(",").map((item, index) => (
          <React.Fragment key={index}>
            {renderExtra(item, record)}
            <br />
          </React.Fragment>
        ));
        return route;
      },
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(studyStatus(value), record),
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de entrega", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => renderExtra(value, record),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (value, record) =>
        record.seguimiento && (
          <IconButton
            title="Editar ruta"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/trackingOrder/${record.id}`);
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
