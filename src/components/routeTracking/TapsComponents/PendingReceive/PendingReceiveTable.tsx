import { Button, Col, Row, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";
import IconButton from "../../../../app/common/button/IconButton";
import {
  IColumns,
  ISearch,
  defaultPaginationProperties,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IRouteTrackingList } from "../../../../app/models/routeTracking";
import { useStore } from "../../../../app/stores/store";
import { v4 as uuid } from "uuid";
import TrackingTimeline from "../../content/TrackingTimeline";

const { Text } = Typography;

const PendingReceiveTable = () => {
  const { routeTrackingStore } = useStore();
  const { loadingRoutes, receiveStudyTags } = routeTrackingStore;

  let navigate = useNavigate();

  const [trackingStatus, setTrackingStatus] = useState<number>(0);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const renderExtra = (value: any, record: IRouteTrackingList) => {
    if (record.extra) {
      return <Text style={{ color: "#1890ff" }}>{value}</Text>;
    } else {
      return <Text>{value}</Text>;
    }
  };

  const columns: IColumns<IRouteTrackingList> = [
    {
      ...getDefaultColumnProps("seguimiento", "No. de seguimiento", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
      }),
      render: (value, route) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/receiveTracking/${route.id}`);
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
      render: (value, record) => renderExtra(value, record),
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
        width: "15%",
      }),
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
    },
    {
      ...getDefaultColumnProps("estatusSeguimiento", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value: number) => (
        <IconButton
          title="estatus"
          icon={<ClockCircleOutlined />}
          onClick={() => {
            setTrackingStatus(value);
          }}
        />
      ),
    },
  ];

  return (
    <Row gutter={[0, 12]}>
      {trackingStatus ? (
        <Col span={24}>
          <TrackingTimeline estatus={trackingStatus} title={true} />
        </Col>
      ) : (
        ""
      )}
      <Col span={24}>
        <Table<IRouteTrackingList>
          loading={loadingRoutes}
          rowKey={uuid()}
          columns={columns}
          dataSource={[...receiveStudyTags]}
          pagination={defaultPaginationProperties}
          bordered
        ></Table>
      </Col>
    </Row>
  );
};

export default observer(PendingReceiveTable);
