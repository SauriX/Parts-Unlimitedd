import {
    Button,
    Divider,
    PageHeader,
    Spin,
    Table,
    Form,
    Row,
    Col,
    Modal,
    Pagination,
    Image
  } from "antd";
  import React, { FC, Fragment, useEffect, useRef, useState, } from "react";
  import {
    defaultPaginationProperties,
    getDefaultColumnProps,
    IColumns,
    ISearch,
  } from "../../app/common/table/utils";
  import { formItemLayout } from "../../app/util/utils";
  import { IParameterList } from "../../app/models/parameter";
  import useWindowDimensions, { resizeWidth } from "../../app/util/window";
  import { EditOutlined, LockOutlined } from "@ant-design/icons";
  import IconButton from "../../app/common/button/IconButton";
  import { useNavigate, useParams, useSearchParams } from "react-router-dom";
  import { useStore } from "../../app/stores/store";
  import { observer } from "mobx-react-lite";
  import HeaderTitle from "../../app/common/header/HeaderTitle";
  import { IStudyList } from "../../app/models/study";
  import views from "../../app/util/view";
import {shipmentStudy, shipmenttracking} from "../../app/models/shipmentTracking";
import { TrackingFormValues } from "../../app/models/routeTracking";
  type StudyTableProps = {
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
  };
  type UrlParams = {
    id: string;
  };
  const ShipmentTackingDetail: FC<StudyTableProps> = ({ componentRef, printing }) => {
    const [loading, setLoading] = useState(false);
    const [shipments,setShipments] = useState<shipmenttracking>();
    const [estudios,setEstudios] = useState<shipmentStudy[]>([]);
    let navigate = useNavigate();
    const { id } = useParams<UrlParams>();
    const { routeTrackingStore,shipmentTracking} = useStore();

    const {getAll,studys}= routeTrackingStore;
    const { getashipment,shipment}=shipmentTracking;
    useEffect(()=>{
      var readshipment = async()=>{
        setLoading(true);
        console.log(id!,"el id");
       var ship= await getashipment(id!);
       console.log(ship,"te ship");
       setEstudios(ship?.estudios!);
          setLoading(false);
   
        
      }
      readshipment();
    },[getashipment,id]); 

     useEffect(()=>{
      var readroute = async()=>{
        var search = new  TrackingFormValues();
          await getAll(search);
      }
        readroute();
    },[getAll]);


    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
      const { width: windowWidth } = useWindowDimensions();
      const actualMaquilador = () => {
        if (id) {
          const index = studys.findIndex((x) => x.id === id);
          return index + 1;
        }
        return 0;
      };
      const prevnextMaquilador = (index: number) => {
        const maquila = studys[index];
        navigate(`/eShipmentTracking/${maquila.id}`);
      };
    const columns: IColumns<shipmentStudy> = [
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
        <Spin spinning={loading }>
            <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
                <Pagination
                size="small"
                total={ studys.length}
                pageSize={1}
                current={actualMaquilador()}
                onChange={(value) => {
                       prevnextMaquilador(value - 1);
                }}
                />
            </Col>
            <br />
              <Row>
              <Col md={8}>
                Numero de Seguimiento: {shipment?.seguimiento}
              </Col>
              <Col md={8}>
                Ruta: {shipment?.ruta}
              </Col>
              <Col md={8}>
                Nombre: {shipment?.nombre}
              </Col>
              </Row>
            <Row>
                <Col md={11}>
                    <div
                        style={{
                            // backgroundColor: "#F2F2F2",
                            height: "auto",
                            borderStyle: "solid",
                            borderColor: "#CBC9C9",
                            borderWidth: "1px",
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    >
                        <Row>
                            <Col md={10}></Col>
                            <Col md={10}>
                                <Image
                                        width={50}
                                        height={50}
                                        src="origen"
                                        fallback={`/${process.env.REACT_APP_NAME}/admin/assets/origen.png`}
                                        style={{marginLeft:"0%"}}
                                />
                            </Col>
                            <Col md={2}></Col>
                            Origen-------------------------------------------------------------------------
                            <br />
                            <br />
                            Sucursal: {shipment?.sucursalOrigen}
                            <br />
                            Responsable de envio: {shipment?.responsableOrigen}
                            <br />
                            Medio de entrega: {shipment?.medioentrega}
                            <br />
                            Fecha de envío: {shipment?.fechaEnvio.format('MMMM Do, YYYY')}
                            <br />
                            Hora de envío: {shipment?.horaEnvio.utc().format('hA:mm')}
                            <br />
                        </Row>
                    </div>
                </Col>
                <Col md={1}></Col>
                <Col md={11}>
                    <div
                            style={{
                                // backgroundColor: "#F2F2F2",
                                height: "auto",
                                borderStyle: "solid",
                                borderColor: "#CBC9C9",
                                borderWidth: "1px",
                                borderRadius: "10px",
                                padding: "10px",
                            }}
                    >
                                                <Row>
                            <Col md={10}></Col>
                            <Col md={12}>
                                <Image
                                        width={50}
                                        height={50}
                                        src="origen"
                                        fallback={`/${process.env.REACT_APP_NAME}/admin/assets/destino.png`}
                                        style={{marginLeft:"0%"}}
                                />
                            </Col>
                            <Col md={2}></Col>
                            Destino--------------------------------------------------------------------------
                            <br />
                            Sucursal: {shipment?.sucursalDestino}
                            <br />
                            Responsable de recibido: {shipment?.responsableDestino}
                            <br />
                            Fecha de entrega estimada: {shipment?.fechaEnestimada.format('MMMM Do, YYYY')}
                            <br />
                            Hora de entrega estimada: {shipment?.horaEnestimada.utc().format('hA:mm')}
                            <br />
                             Fecha de entrega real:{ shipment!.fechaEnreal.format('MMMM Do, YYYY')=="Fecha inválida"?"":shipment!.fechaEnreal.format('MMMM Do, YYYY')}
                            <br />
                            Hora de entrega real: {shipment!.horaEnreal.utc().format('hA:mm')=="Fecha inválida"?"":shipment!.horaEnreal.utc().format('hA:mm')} 
                        </Row>
                    </div>
                </Col>
            </Row>
            </Spin>
            <Fragment>
            <br />
            <Table<shipmentStudy>
                loading={ loading }
                size="small"
                rowKey={(record) => record.id}  
                columns={columns}
                dataSource={ [...estudios]}
                pagination={defaultPaginationProperties}
                sticky
                scroll={{ x: "max-content" }}
            />
{/*             <div style={{ display: "none" }}>{<ParameterTablePrint />}</div> */}
            </Fragment>
      </Fragment>
      
    );
  };
  
  export default observer(ShipmentTackingDetail);
  