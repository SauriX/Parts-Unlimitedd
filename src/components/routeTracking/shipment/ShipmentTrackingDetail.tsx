import {
  Spin,
  Table,
  Row,
  Col,
  Pagination,
  Typography,
  Tag,
  PageHeader,
  Divider,
  Steps,
} from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions from "../../../app/util/window";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { IShipmentTags } from "../../../app/models/shipmentTracking";
import moment from "moment";
import "./../css/tracking.less";
import DescriptionItem from "../../../app/common/display/DescriptionItem";
import ShipmentTrackingTitle from "./content/ShipmentTrackingTitle";
import { studyStatus } from "../../../app/util/catalogs";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import TrackingTimeline from "../content/TrackingTimeline";

type StudyTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

type UrlParams = {
  id: string;
};

const ShipmentTackingDetail: FC<StudyTableProps> = ({
  componentRef,
  printing,
}) => {
  const { routeTrackingStore, shipmentTracking } = useStore();
  const { getActive, shipmentList: trackingOrders } = routeTrackingStore;
  const { getShipmentById, shipment, loadingOrders } = shipmentTracking;

  const [studies, setStudies] = useState<IShipmentTags[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  let navigate = useNavigate();
  const { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    let readshipment = async (id: string) => {
      let shipment = await getShipmentById(id);

      if (shipment) setStudies(shipment.estudios);
    };

    if (id) {
      readshipment(id);
    }
  }, [getShipmentById, id]);

  useEffect(() => {
    const readOrders = async () => {
      await getActive();
    };

    readOrders();
  }, [getActive]);

  const onPageChange = (page: number) => {
    const trackingOrder = trackingOrders[page - 1];
    navigate(`/ShipmentTracking/${trackingOrder.id}`);
  };

  const getPage = (trackingOrderId?: string) => {
    return trackingOrders.findIndex((x) => x.id === trackingOrderId) + 1;
  };

  const columns: IColumns<IShipmentTags> = [
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
        width: "9%",
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        width: "5%",
      }),
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
        width: "8%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "8%",
      }),
      render: (value) => {
        return studyStatus(value);
      },
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre de paciente", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "confirmacionOrigen",
      dataIndex: "confirmacionOrigen",
      title: "Confirmación Recolección",
      align: "center",
      width: "10%",
      render: (value) =>
        value ? (
          <CheckCircleTwoTone twoToneColor="green" />
        ) : (
          <MinusCircleTwoTone twoToneColor="#FFCC00" />
        ),
    },
    {
      key: "confirmacionDestino",
      dataIndex: "confirmacionDestino",
      title: "Confirmación Recepción",
      width: "10%",
      align: "center",
      render: (value) => <MinusCircleTwoTone twoToneColor="#FFCC00" />,
    },
  ];

  return (
    <Fragment>
      <Spin spinning={loadingOrders}>
        <Row gutter={[24, 16]}>
          <Col md={8} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={studies.length}
              pageSize={1}
              current={getPage(id)}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </Col>
          <Col span={16}>
            <ShipmentTrackingTitle shipment={shipment} />
          </Col>
          <Col md={12}>
            <div className="tracking-card">
              <Row gutter={[0, 4]}>
                <Col md={24}>
                  <PageHeader
                    title="Origen"
                    className="header-container-padding"
                    tags={
                      <Tag color="blue">
                        {shipment?.activo ? "Activo" : "Inactivo"}
                      </Tag>
                    }
                    avatar={{
                      src: `${process.env.REACT_APP_NAME}/assets/origen.png`,
                    }}
                  ></PageHeader>
                </Col>
                <Divider className="header-divider"></Divider>
                <Col md={8}>
                  <DescriptionItem
                    title="Sucursal"
                    content={shipment?.origen}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Responsable de envío"
                    content={shipment?.emisor}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Medio de entrega"
                    content={shipment?.paqueteria}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Fecha de envío"
                    content={moment(shipment?.fechaEnvio).format("DD/MM/YYYY")}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Hora de envío"
                    content={moment(shipment?.fechaEnvio).format("h:mmA")}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={12}>
            <div className="tracking-card">
              <Row gutter={[0, 4]}>
                <Col md={24}>
                  <PageHeader
                    title="Destino"
                    className="header-container-padding"
                    avatar={{
                      src: `${process.env.REACT_APP_NAME}/assets/destino.png`,
                      shape: "square",
                    }}
                  ></PageHeader>
                </Col>
                <Divider className="header-divider"></Divider>
                <Col md={8}>
                  <DescriptionItem
                    title="Sucursal"
                    content={shipment?.destino}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Responsable de recibido"
                    content={shipment?.receptor ?? "N/A"}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Fecha de entrega estimada"
                    content={moment(shipment?.fechaEstimada).format(
                      "DD/MM/YYYY"
                    )}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Hora de entrega estimada"
                    content={moment(shipment?.fechaEstimada).format("h:mmA")}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Fecha de entrega real"
                    content="N/A"
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem title="Hora de entrega real" content="N/A" />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={24}>
            <TrackingTimeline estatus={shipment?.estatus} />
          </Col>
        </Row>
        <br />
        <Table<IShipmentTags>
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={[...studies]}
          pagination={defaultPaginationProperties}
          sticky
          scroll={{ x: "max-content", y: 300 }}
        />
      </Spin>
    </Fragment>
  );
};

export default observer(ShipmentTackingDetail);
