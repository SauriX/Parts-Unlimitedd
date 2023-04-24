import {
  Button,
  Spin,
  Table,
  Row,
  Col,
  Pagination,
  Image,
  InputNumber,
  Switch,
  Divider,
  PageHeader,
  Tag,
  Select,
} from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
  defaultPaginationProperties,
} from "../../../app/common/table/utils";
import {
  reciveTracking,
  reciveStudy,
} from "../../../app/models/ReciveTracking";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import views from "../../../app/util/view";
import useWindowDimensions from "../../../app/util/window";
import Check from "./alerts/check";
import End from "./alerts/end";
import Scan from "./alerts/scan";
import Uncheck from "./alerts/uncheck";
import DescriptionItem from "../../../app/common/display/DescriptionItem";
import moment from "moment";
import TrackingTimeline from "../content/TrackingTimeline";
import ShipmentTrackingTitle from "../shipment/content/ShipmentTrackingTitle";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import { IShipmentTags } from "../../../app/models/shipmentTracking";
import { studyStatus } from "../../../app/util/catalogs";

type StudyTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
type UrlParams = {
  id: string;
};

const ReceiveTrackingDetail: FC<StudyTableProps> = ({
  componentRef,
  printing,
}) => {
  const { routeTrackingStore, shipmentTracking, modalStore } = useStore();
  const { getActive, shipmentList: trackingOrders } = routeTrackingStore;
  const { getShipmentById, shipment, loadingOrders } = shipmentTracking;
  const { openModal, closeModal } = modalStore;

  const [loading, setLoading] = useState(false);
  const [studies, setStudies] = useState<IShipmentTags[]>([]);
  const [acepted, setacepted] = useState<reciveStudy>({
    id: "",
    estudio: "",
    paciente: "",
    solicitud: "",
    confirmacionOrigen: false,
    confirmacionDestino: false,
    temperatura: 0,
  });

  const [alertAcept, setAlertacept] = useState<boolean>(false);
  const [alertScan, setAlertScan] = useState<boolean>(false);
  const [scanSwitch, setScanSwitch] = useState<boolean>(false);
  const [alertFin, SetAlertFind] = useState<boolean>(false);
  const [estudios, setEstudios] = useState<reciveStudy[]>([]);
  let navigate = useNavigate();
  const { id } = useParams<UrlParams>();

  useEffect(() => {
    let readshipment = async (id: string) => {
      let shipment = await getShipmentById(id);

      if (shipment) setStudies(shipment.estudios);
    };

    if (id) {
      readshipment(id);
    }
  }, [getShipmentById, id]);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const { width: windowWidth } = useWindowDimensions();

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
      render: (value) => (
        <Select
          allowClear
          options={[
            { label: "Destino Final", value: true },
            { label: "Destino intermedio", value: false },
          ]}
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  // {
  //   key: "confirmacionDestino",
  //   dataIndex: "confirmacionDestino",
  //   title: "Confirmación Muestra Destino",
  //   align: "center",
  //   width: 100,
  //   render: (value, item) => (
  //     <Switch
  //       checked={value}
  //       onChange={(value) => {
  //         onAcept(item, value);
  //       }}
  //     ></Switch>
  //   ),
  // },

  const onAcept = async (item: reciveStudy, status: boolean) => {
    item.confirmacionDestino = status;
    if (!status) {
      var estudys = estudios;
      var index = estudys.indexOf(item);
      estudys[index] = item;
      setEstudios(estudys);
      setacepted(item);
      setAlertacept(false);
      openModal({
        title: "Escanear",
        body: <Uncheck acepted={item}></Uncheck>,
        width: 500,
      });
      setTimeout(function () {
        closeModal();
      }, 2000);
    } else {
      var estudys = estudios;
      var index = estudys.indexOf(item);
      estudys[index] = item;
      setEstudios(estudys);
      setacepted(item);
      setAlertacept(true);
      openModal({
        title: "Escanear",
        body: <Check acepted={item}></Check>,
        width: 500,
      });
      setTimeout(function () {
        closeModal();
      }, 2000);
    }
  };
  const onScan = async (status: boolean) => {
    setAlertScan(status);
    if (status) {
      openModal({
        title: "Escanear",
        body: (
          <Scan closeModal={closeModal} setScanSwitch={setScanSwitch}></Scan>
        ),
        width: 500,
      });
    }
  };
  const checkStudy = () => {
    var contador = 0;
    estudios.forEach((element) => {
      if (!element.confirmacionDestino) {
        contador++;
      }
    });
    if (contador > 0) {
      openModal({
        title: "Escanear",
        body: <End onFinish={onFinish} closeModal={closeModal}></End>,
        width: 500,
      });
    } else {
      onFinish();
    }
  };
  const temperatura = (value: number) => {
    var estudys = estudios;
    estudys = estudios.map((x) => ({ ...x, temperatura: value }));
    setEstudios(estudys);
  };
  const temperaturaIn = (value: number, item: reciveStudy) => {
    var estudys = [...estudios];
    var index = estudys.indexOf(item);

    item.temperatura = value;

    estudys[index] = item;

    setEstudios(estudys);
  };

  const onPageChange = (page: number) => {
    const trackingOrder = trackingOrders[page - 1];
    navigate(`/ShipmentTracking/${trackingOrder.id}`);
  };

  const getPage = (trackingOrderId?: string) => {
    return trackingOrders.findIndex((x) => x.id === trackingOrderId) + 1;
  };

  const onFinish = async () => {
    // if (alertFin) {
    //   SetAlertFind(false);
    // }
    // setLoading(true);
    // var valuesfinal = recives;
    // valuesfinal!.estudios = estudios;
    // var succes = await updateRecive(valuesfinal!);
    // setLoading(false);

    // if (succes) {
    //   navigate(`/${views.recivetracking}/${valuesfinal?.id}`);
    //   alerts.success("Registro guardado con éxito");
    // }
    console.log("update");
  };

  return (
    <Fragment>
      <Spin spinning={loading}>
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
      </Spin>
      <Fragment>
        <br />
        <Fragment>
          <Row>
            <Col md={12}>
              {/* extras */}
              {false && (
                <div
                  style={{
                    height: "auto",
                    borderStyle: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                    borderRadius: "10px",
                    padding: "10px",
                    width: "50%",
                    marginLeft: "40%",
                  }}
                >
                  <Image
                    width={50}
                    height={50}
                    src="origen"
                    fallback={`${process.env.REACT_APP_NAME}/assets/danger.png`}
                    style={{ marginLeft: "290%" }}
                  />
                  <br />
                  Se detectaron muestras que no corresponden a ninguna solicitud
                  de muestra a recibir.
                  <br />
                  <br />
                  <Row>
                    <Col md={12}>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: " #18AC50",
                          marginLeft: "45%",
                        }}
                      >
                        NOTIFICAR
                      </Button>
                    </Col>
                    <Col md={12}>
                      <Button type="primary" danger>
                        CANCELAR
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
            <Col md={6}>
              <label htmlFor="">Escaneo por código de barras:</label>
              <br />
              <Switch
                checked={scanSwitch}
                onChange={(value) => {
                  onScan(value);
                  setScanSwitch(value);
                }}
              ></Switch>
              {scanSwitch && (
                <div>
                  <br />
                  <label htmlFor="">Codigo: </label>
                  <InputNumber></InputNumber>
                </div>
              )}
            </Col>
            <Col md={6}>
              <label htmlFor="">Temperatura: </label>
              <InputNumber
                onChange={(value) => {
                  temperatura(Number(value));
                }}
              ></InputNumber>
            </Col>
          </Row>
        </Fragment>
        <br />
        <Table<IShipmentTags>
          loading={loading}
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={[...studies]}
          pagination={defaultPaginationProperties}
          sticky
          scroll={{ x: "max-content" }}
        />
        {/* <Button
          style={{ marginLeft: "90%" }}
          type="primary"
          danger
          onClick={() => {
            checkStudy();
          }}
        >
          Finalizar escaneo
        </Button> */}
      </Fragment>
    </Fragment>
  );
};

export default observer(ReceiveTrackingDetail);
