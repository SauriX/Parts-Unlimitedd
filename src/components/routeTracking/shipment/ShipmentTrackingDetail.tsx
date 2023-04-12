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
import { IShipmentStudies } from "../../../app/models/shipmentTracking";
import { IRouteTrackingList } from "../../../app/models/routeTracking";
import moment from "moment";
import "./../css/tracking.less";
import DescriptionItem from "../../../app/common/display/DescriptionItem";
import ShipmentTrackingTitle from "./content/ShipmentTrackingTitle";
import DescriptionTitle from "../../../app/common/display/DescriptionTitle";

const { Title, Text } = Typography;

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
  const { getAll, filterSend: searchrecive } = routeTrackingStore;
  const { getShipmentById, shipment, loadingOrders } = shipmentTracking;

  const [estudios, setEstudios] = useState<IRouteTrackingList[]>([]);
  const [studies, setStudies] = useState<IShipmentStudies[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  let navigate = useNavigate();
  const { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    var readshipment = async () => {
      var shipment = await getShipmentById(id!);
      setStudies(shipment!.estudios);
    };

    readshipment();
  }, [getShipmentById, id]);

  // useEffect(() => {
  //   var readroute = async () => {
  //     let estudiosrute = await getAll(searchrecive);

  //     let pivote = estudiosrute![0];
  //     let result: IRouteTrackingList[] = [];
  //     result.push(pivote);
  //     estudiosrute!.forEach((element) => {
  //       if (element.seguimiento != pivote.seguimiento) {
  //         pivote = element;
  //         result.push(element);
  //       }
  //     });
  //     setEstudioslist(result);
  //   };
  //   readroute();
  // }, [getAll]);

  const actual = () => {
    if (id) {
      const index = studies.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };

  const prevnext = (index: number) => {
    const maquila = studies[index];
    navigate(`/ShipmentTracking/${maquila.id}`);
  };

  const columns: IColumns<IShipmentStudies> = [
    {
      ...getDefaultColumnProps("estudio", "Estudio", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre de paciente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "confirmacionOrigen",
      dataIndex: "confirmacionOrigen",
      title: "Confirmación Muestra Origen",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "confirmacionDestino",
      dataIndex: "confirmacionDestino",
      title: "Confirmación Muestra Destino",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
  ];

  return (
    <Fragment>
      <Spin spinning={loadingOrders}>
        <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
          <Pagination
            size="small"
            total={studies.length}
            pageSize={1}
            current={actual()}
            onChange={(value) => {
              prevnext(value - 1);
            }}
          />
        </Col>
        {/* <ShipmentTrackingTitle shipment={shipment} /> */}
        <Row gutter={[4, 0]} justify="space-between">
          <Col span={8}>
            <DescriptionTitle
              title="No. de seguimiento"
              content={shipment!.seguimiento}
            />
          </Col>
          <Col span={8}>
            <DescriptionTitle title="Ruta" content={shipment!.ruta} />
          </Col>
          <Col span={8}>
            <DescriptionTitle title="Nombre" content={shipment!.nombre} />
          </Col>
        </Row>
        <Row gutter={[24, 16]}>
          <Col md={12}>
            <div className="tracking-card">
              <Row gutter={[0, 4]}>
                <Col md={24}>
                  <PageHeader
                    title="Origen"
                    className="header-container-padding"
                    tags={<Tag color="blue">Activo</Tag>}
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
                  <DescriptionItem title="Medio de entrega" content="" />
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
                    content={moment(shipment?.fechaReal).format("DD/MM/YYYY")}
                  />
                </Col>
                <Col md={8}>
                  <DescriptionItem
                    title="Hora de entrega real"
                    content={moment(shipment?.fechaReal).format("h:mmA")}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Table<IShipmentStudies>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={[...studies!]}
            pagination={defaultPaginationProperties}
            sticky
            scroll={{ x: "max-content" }}
          />
        </Row>
      </Spin>
    </Fragment>
  );
};

export default observer(ShipmentTackingDetail);
