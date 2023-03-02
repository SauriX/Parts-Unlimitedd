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
import { TrackingFormValues,IRouteTrackingList } from "../../app/models/routeTracking";

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
    const [estudioslist,setEstudioslist] = useState<IRouteTrackingList[]>([]);
    let navigate = useNavigate();
    const { id } = useParams<UrlParams>();
    const { routeTrackingStore,shipmentTracking} = useStore();

    const {getAll,studys, searchrecive}= routeTrackingStore;
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
        let estudiosrute =  await getAll(searchrecive);

        let pivote = estudiosrute![0];
        let result:IRouteTrackingList[]=[];
        result.push(pivote);
        estudiosrute!.forEach(element => {
            if(element.seguimiento != pivote.seguimiento){
              pivote = element;
              result.push(element);
            }
        });
        setEstudioslist(result);

      }
        readroute();
    },[getAll]);


    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
      const { width: windowWidth } = useWindowDimensions();
      const actual = () => {
        if (id) {
          const index = estudioslist.findIndex((x) => x.id === id);
          return index + 1;
        }
        return 0;
      };
      const prevnext= (index: number) => {
        const maquila = estudioslist[index];
        navigate(`/ShipmentTracking/${maquila.id}`);
       // navigate(`/${views.route}/${route.id}?${searchParams}&mode=readonly`);
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
                total={ estudioslist.length}
                pageSize={1}
                current={actual()}
                onChange={(value) => {
                       prevnext(value - 1);
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
                                        fallback={`${process.env.REACT_APP_NAME}/assets/origen.png`}
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
                            Fecha de envío: {shipment?.fechaEnvio.format('MMMM D, YYYY')}
                            <br />
                            Hora de envío: {shipment?.horaEnvio.utc().format('h:mmA')}
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
                                        fallback={`${process.env.REACT_APP_NAME}/assets/destino.png`}
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
                            Fecha de entrega estimada: {shipment?.fechaEnestimada.format('MMMM D, YYYY')}
                            <br />
                            Hora de entrega estimada: {shipment?.horaEnestimada.utc().format('h:mmA')}
                            <br />
                             Fecha de entrega real:{ shipment?.fechaEnreal.format('MMMM D, YYYY')=="Fecha inválida"?"":shipment?.fechaEnreal.format('MMMM D, YYYY')}
                            <br />
                            Hora de entrega real: {shipment?.horaEnreal.utc().format('h:mmA')=="Fecha inválida"?"":shipment?.horaEnreal.utc().format('h:mmA')} 
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
  