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

  const [trackingStatus, setTrackingStatus] = useState<IRouteTrackingList>();
  const [isActive, setIsActive] = useState<boolean>(false);
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
      return <Text style={{ color: "#253B65" }} strong>{value + "(E)"}</Text>;
    } else if (record.extra) {
      return <Text style={{ color: "#253B65" }} strong>{value}</Text>;
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
        width: "15%",
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
      render: (value, record) => renderExtra(value, record),
    },
    {
      ...getDefaultColumnProps("estatusSeguimiento", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value: number, record) => (
        <IconButton
          title="Estatus"
          icon={<ClockCircleOutlined />}
          onClick={() => {
            setTrackingStatus(record);
            setIsActive((prevState) => !prevState);
          }}
        />
      ),
    },
  ];

  return (
    <Row gutter={[0, 12]}>
      {trackingStatus && isActive ? (
        <Col span={24}>
          <TrackingTimeline record={trackingStatus} title={true} />
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
