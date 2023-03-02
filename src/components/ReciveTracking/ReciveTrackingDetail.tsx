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
    Image,
    InputNumber,
    Switch
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
import { reciveStudy, reciveTracking } from "../../app/models/ReciveTracking";
import { searchValues } from "../../app/models/pendingRecive";
import alerts from "../../app/util/alerts";
import scan from "./alerts/scan";
import Scan from "./alerts/scan";
import Check from "./alerts/check";
import Uncheck from "./alerts/uncheck";
import End from "./alerts/end";
  type StudyTableProps = {
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
  };
  type UrlParams = {
    id: string;
  };

  const ReciveTackingDetail: FC<StudyTableProps> = ({ componentRef, printing }) => {
    const [loading, setLoading] = useState(false);
    const [recives,setrecives] = useState<reciveTracking>();
    const [acepted,setacepted]=useState<reciveStudy>({    id:"",
    estudio:"",
    paciente:"",
    solicitud:"",
    confirmacionOrigen:false,
    confirmacionDestino:false,
    temperatura:0});

    const [alertAcept,setAlertacept]=useState<boolean>(false);
    const [alertUnAcept,setAlertUnacept]=useState<boolean>(false);
    const [alertScan,setAlertScan]=useState<boolean>(false);
    const [scanSwitch,setScanSwitch]=useState<boolean>(false);
    const[alertFin,SetAlertFind]=useState<boolean>(false);
    const [estudios,setEstudios] = useState<reciveStudy[]>([]);
    let navigate = useNavigate();
    const { id } = useParams<UrlParams>();
    const { routeTrackingStore,shipmentTracking,modalStore} = useStore();

    const {getAllRecive,pendings,searchPending}= routeTrackingStore;
    const { getaRecive,recive,updateRecive}=shipmentTracking;
    const {openModal,closeModal}=modalStore
    useEffect(()=>{
      var readshipment = async()=>{
        setLoading(true);
        console.log(id!,"el id");
       var ship= await getaRecive(id!);
       setrecives(ship);
       console.log(ship,"te ship");
       setEstudios(ship?.estudios!); 
          setLoading(false);
   
        
      }
      readshipment();
    },[getaRecive,id]); 
      
     useEffect(()=>{
      var readroute = async()=>{
        
          await getAllRecive(searchPending!);
      }
        readroute();
    },[getAllRecive]);

    
    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
      const { width: windowWidth } = useWindowDimensions();
      const actualMaquilador = () => {
        if (id) {
          const index = pendings!.findIndex((x) => x.id === id);
          return index + 1;
        }
        return 0;
      };
      const prevnextMaquilador = (index: number) => {
        const maquila = pendings![index];
        navigate(`/eShipmentTracking/${maquila.id}`);
      };
      
    const columns: IColumns<reciveStudy> = [
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
          render: (value,item) => (<Switch  checked={value} onChange={(value)=>{onAcept(item,value);}}></Switch>),
        },
        {
          key: "editarc",
          dataIndex: "temperatura",
          title: "Temperatura",
          align: "center",
          width:  100 ,
          render: (value,item) => (
            <InputNumber type={"number"}   value={value}    onChange={(value)=>temperaturaIn(value,item)} ></InputNumber>
          ),
        },
      ];
      const onAcept= async (item:reciveStudy,status:boolean)=>{
        item.confirmacionDestino=status;
        console.log("here");
        if(!status){
          var estudys = estudios;
          var index=estudys.indexOf(item);
          estudys[index]=item;
          setEstudios(estudys);
          setacepted(item);
          setAlertacept(false);
          openModal({
            title: "Escanear",
            body:<Uncheck acepted={item}></Uncheck>,
            width: 500,
          })
          setTimeout(function () {
            closeModal();
        }, 2000);
        }else{        
          var estudys = estudios;
          var index=estudys.indexOf(item);
          estudys[index]=item;
          setEstudios(estudys);
          setacepted(item);
          setAlertacept(true);
          openModal({
            title: "Escanear",
            body:<Check acepted={item}></Check>,
            width: 500,
          })
          setTimeout(function () {
            closeModal();
        }, 2000);
      }
      };
      const onScan = async(status:boolean)=>{
          setAlertScan(status);
          if(status){          openModal({
            title: "Escanear",
            body:<Scan closeModal={closeModal} setScanSwitch={setScanSwitch}></Scan>,
            width: 500,
          })}

      }
      const checkStudy =()=>{
        var contador =0;
        estudios.forEach(element => {
          if(!element.confirmacionDestino){
            contador++
          }
        });
        if(contador>0){
          openModal({
            title: "Escanear",
            body:<End onFinish={onFinish} closeModal={closeModal}></End>,
            width: 500,
          })
        }else{
          onFinish();
        }

      }
      const temperatura = (value:number)=>{
        console.log(value);
        var estudys = estudios;
        estudys = estudios.map((x)=>({...x,temperatura:value}));
        setEstudios(estudys);
        console.log(estudios);
      }
      const temperaturaIn = (value:number,item:reciveStudy)=>{
  

        var estudys = [...estudios];
        var index = estudys.indexOf(item);
   
        item.temperatura=value;

        estudys[index]=item;

        setEstudios(estudys);
       
      }
      const onFinish=async ()=>{
        if(alertFin){
          SetAlertFind(false);
        }
        setLoading(true);
        var valuesfinal =recives;
        valuesfinal!.estudios= estudios; 
        var succes = await updateRecive(valuesfinal!); 
        setLoading(false);

        if(succes){
          navigate(`/${views.recivetracking}/${valuesfinal?.id}`);
          alerts.success("Registro guardado con éxito");
        }

      }
    return (
      
      <Fragment>
       <Spin spinning={ loading  }>
            <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
                <Pagination
                size="small"
                total={ pendings!.length}
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
                Numero de Seguimiento: {recive?.seguimiento}
              </Col>
              <Col md={8}>
                Ruta: {recive?.ruta}
              </Col>
              <Col md={8}>
                Nombre: {recive?.nombre}
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
                            Sucursal: {recive?.sucursalOrigen}
                            <br />
                            Responsable de envio: {recive?.responsableOrigen}
                            <br />
                            Medio de entrega: {recive?.medioentrega}
                            <br />
                            Fecha de envío: {recive?.fechaEnvio.format('MMMM D, YYYY')}
                            <br />
                            Hora de envío: {recive?.horaEnvio.utc().format('h:mmA')}
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
                            Sucursal: {recive?.sucursalDestino}
                            <br />
                            Responsable de recibido: {recive?.responsableDestino}
                            <br />
                            Fecha de entrega estimada: {recive?.fechaEnestimada.format('MMMM D, YYYY')}
                            <br />
                            Hora de entrega estimada: {recive?.horaEnestimada.utc().format('h:mmA')}
                            <br />
                             Fecha de entrega real:{ recive?.fechaEnreal.format('MMMM D, YYYY')=="Enero 1, 0001"?"":recive?.fechaEnreal.format('MMMM D, YYYY')}
                            <br />
                            Hora de entrega real: {recive?.horaEnreal.utc().format('h:mmA')=="5:47AM"?"":recive?.horaEnreal.utc().format('h:mmA')} 
                        </Row>
                    </div>
                </Col>
            </Row>
             </Spin> 
            <Fragment>
            <br />
            <Fragment>
              <Row>
                
                <Col md ={12}>


                  {/* extras */}
{                false&&  <div style={{
                                height: "auto",
                                borderStyle: "solid",
                                borderColor: "#000000",
                                borderWidth: "1px",
                                borderRadius: "10px",
                                padding: "10px",
                                width:"50%",
                                marginLeft:"40%"
                  }}>
                  <Image
                                        width={50}
                                        height={50}
                                        src="origen"
                                        fallback={`${process.env.REACT_APP_NAME}/assets/danger.png`}
                                        style={{marginLeft:"290%"}}
                                />
                                <br />
                                Se detectaron muestras que no corresponden a ninguna solicitud de  muestra a recibir.
                                <br />
                                <br />
                                <Row>
                          <Col md={12}><Button type="primary" style={{backgroundColor:" #18AC50",marginLeft:"45%"}}>NOTIFICAR</Button></Col>
                          <Col md={12} ><Button type="primary" danger>CANCELAR</Button></Col>
                        </Row>

                  </div>}
                </Col>
                <Col md ={6}>
                  <label htmlFor="">Escaneo por código de barras:</label>
                  <br />
                  <Switch checked={scanSwitch} onChange={(value)=>{onScan(value);setScanSwitch(value);}}></Switch>
                  {scanSwitch&&<div><br />
                  <label htmlFor="">Codigo:  </label>
                  <InputNumber ></InputNumber></div>}
                </Col>
                <Col md ={6}>
                <label htmlFor="">Temperatura:  </label>
                  <InputNumber  onChange={(value)=>{  temperatura(Number(value)) }}></InputNumber>
                </Col>
              </Row>
            </Fragment>
            <br />
            <Table<reciveStudy>
                loading={  loading }
                size="small"
                rowKey={(record) => record.id}  
                columns={columns}
                dataSource={  [...estudios] }
                pagination={defaultPaginationProperties}
                sticky
                scroll={{ x: "max-content" }}
            />
            <Button style={{marginLeft:"90%"}} type="primary" danger onClick={()=>{checkStudy()}}>Finalizar escaneo</Button>
            </Fragment>
      </Fragment>
      
    );
  };
  
  export default observer(ReciveTackingDetail);
  