import { Button, Col, DatePicker, Divider, Input, Row, Select, Table, Tabs, Tooltip, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { PlusCircleOutlined, CalendarOutlined, CloseCircleOutlined, EditOutlined,CheckSquareOutlined } from "@ant-design/icons";
import Agenda from "../../app/common/agenda/Agenda";
import moment from "moment";
import { getDefaultColumnProps, IColumns, ISearch } from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import IconButton from "../../app/common/button/IconButton";
import alerts from "../../app/util/alerts";
import { Days, IAgenda, IAgendaColumn } from "../../app/common/agenda/utils";
import { v4 as uuid } from "uuid";
import views from "../../app/util/view";
import { useNavigate } from "react-router-dom";
import DateRangeInput from "../../app/common/form/DateRangeInput";

import { useStore } from "../../app/stores/store";
import { IAppointmentList } from "../../app/models/appointmen";
import DemoTable from "./AppointmentTable";
import { observer } from "mobx-react-lite";
const { Search } = Input;
const { TabPane } = Tabs;
const { Link, Text } = Typography;

interface IEvent extends IAgenda {
  noSolicitud: string;
}

const TabInfo = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
  return (
    <div>
      {icon} {title}
    </div>
  );
};

const cols: IAgendaColumn[] = [
  {
    id: 1,
    title: "Equipo 1",
  },
  {
    id: 2,
    title: "Equipo 2",
  },
  {
    id: 3,
    title: "Equipo 3",
  },
];
type ProceedingTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const AppointmentCalendar:FC<ProceedingTableProps> = ({componentRef}) => {
  const { RangePicker } = DatePicker;
  const [events, setEvents] = useState<IEvent[]>([]);
  const [tipo, seTipo] = useState("laboratorio");
   const [generadas,Setgeneradas]= useState<IAppointmentList[]>();
   const [agedadas,SetAgendadas]= useState<IAppointmentList[]>();
   const [scan,Setscan]= useState<IAppointmentList[]>();
   const [canceladas,Setceladas]= useState<IAppointmentList[]>();
  const {appointmentStore}= useStore();
  const[citaSelect,SetCita]=useState<IAppointmentList>();
  const {getAllDom,getAllLab,sucursales,getByIdDom,getByIdLab,sucursal,updateDom,updateLab,setSearch,search}=appointmentStore;
    useEffect(()=>{
  
      const readData=async ()=>{
        console.log();
        if(tipo=="laboratorio"){
          var citas = await getAllLab(search);
          console.log(citas,"cirtas");
          var citasgeneradas = citas?.filter(x=>x.tipo==1);
          Setgeneradas(citasgeneradas);
          var citasagendadas = citas?.filter(x=>x.tipo==2);
          console.log( citasagendadas,"agendadas");
          citasagendadas?.forEach(x=>{
            var newEvent: IEvent = {
            id: x.id,
            externalId: 1,
            date: moment(x.fecha),
            noSolicitud: x.nombre,
          };
          console.log(newEvent,"event");
          setEvents((prev) => [...prev, newEvent]);
          
        }
          );

          SetAgendadas(citasagendadas);
          var citasscan= citas?.filter(x=>x.tipo==3);
          Setscan(citasscan);
          var citascance = citas?.filter(x=>x.tipo==4);
          Setceladas(citascance);
        }else{
          var citas= await getAllDom(search);
          var citasgeneradas = citas?.filter(x=>x.tipo==1);
          Setgeneradas(citasgeneradas);
          var citasagendadas = citas?.filter(x=>x.tipo==2);
          SetAgendadas(citasagendadas);
          var citasscan= citas?.filter(x=>x.tipo==3);
          Setscan(citasscan);
          var citascance = citas?.filter(x=>x.tipo==4);
          Setceladas(citascance);
        }
      }
      readData();
      console.log(events,"events");
    },[tipo,getAllDom,getAllLab]);
  let navigate = useNavigate();
  return (
    <div ref={componentRef} >
        <div>
            <Row>
            <Col md={7} sm={10}>
                <label htmlFor="">Nombre/Clave: </label>
                <Input           onChange={(value) => {
                    setSearch({ ...search,nombre:value.target.value })
                }}  style={{width:"250px" , marginBottom:"30px",marginTop:"5px"}} type={"text"} placeholder={""}></Input>
                
            </Col>
            <Col md={7} sm={10}>
            <label htmlFor="">Fechas: </label>
            <RangePicker
                              onChange={(value) => {
                               var  fecha: moment.Moment[]=[];
                                  fecha.push(value?.[0]!)
                                  fecha.push(value?.[1]!)
                    setSearch({ ...search,fecha:fecha })
                }}
              />
              
              </Col>
              <Col md={2} sm={4}>
              <Button type="primary" style={{marginTop:"5px"}} onClick={async ()=>{
                if(tipo=="laboratorio"){
                  var citas = await getAllLab(search);
                  console.log(citas,"cirtas");
                  var citasgeneradas = citas?.filter(x=>x.tipo==1);
                  Setgeneradas(citasgeneradas);
                  var citasagendadas = citas?.filter(x=>x.tipo==2);
                  console.log( citasagendadas,"agendadas");
                  citasagendadas?.forEach(x=>{
                    var newEvent: IEvent = {
                    id: x.id,
                    externalId: 1,
                    date: moment(x.fecha),
                    noSolicitud: x.nombre,
                  };
                  console.log(newEvent,"event");
                  setEvents((prev) => [...prev, newEvent]);
                  
                }
                  );
        
                  SetAgendadas(citasagendadas);
                  var citasscan= citas?.filter(x=>x.tipo==3);
                  Setscan(citasscan);
                  var citascance = citas?.filter(x=>x.tipo==4);
                  Setceladas(citascance);
                }else{
                  var citas= await getAllDom(search);
                  var citasgeneradas = citas?.filter(x=>x.tipo==1);
                  Setgeneradas(citasgeneradas);
                  var citasagendadas = citas?.filter(x=>x.tipo==2);
                  SetAgendadas(citasagendadas);
                  var citasscan= citas?.filter(x=>x.tipo==3);
                  Setscan(citasscan);
                  var citascance = citas?.filter(x=>x.tipo==4);
                  Setceladas(citascance);
                }


              }}>Buscar</Button>
              </Col>
            <Col md={5} sm={12}>
            <label htmlFor="">Tipo de cita: </label>
                <Select value={tipo} style={{width:"150px" , marginBottom:"30px",marginTop:"5px"}} onChange={(value)=>{seTipo(value); setSearch({ ...search,tipo:tipo })}} options={[{label:"Laboratorio",value:"laboratorio"},{label:"Domicilio",value:"domicilio"}]}></Select>
            </Col>

            <Col md={2} sm={12}>
            <Button type="primary" style={{marginTop:"5px"}} onClick={()=>{navigate(`/${views.appointment}/new?type=${tipo}&mode=edit`);}}>Generar</Button>
            </Col>

            </Row>
        </div>
      <Tabs tabPosition="left">
        <TabPane key="1" tab={<TabInfo title="Generadas" icon={<PlusCircleOutlined />} />}>
          <DemoTable status={1} citas={generadas!} tipo={tipo} SetCita={SetCita}/>
        </TabPane>
        <TabPane key="2" tab={<TabInfo title="Agendadas" icon={<CalendarOutlined />} />}>
          <DemoTable status={2} citas={agedadas!} tipo={tipo} SetCita={SetCita}/>
        </TabPane>
        {tipo==="laboratorio"&&
        <TabPane key="3" tab={<TabInfo title="Listas para scan" icon={<CalendarOutlined />} />}>
          <DemoTable status={3} citas={scan!} tipo={tipo} SetCita={SetCita}/>
        </TabPane>}
        <TabPane key="4" tab={<TabInfo title="Canceladas" icon={<CloseCircleOutlined />} />}>
          <DemoTable status={4} citas={canceladas!} tipo={tipo} SetCita={SetCita}/>
        </TabPane>
        <TabPane key="5" tab={<TabInfo title="Terminadas" icon={<CheckSquareOutlined />} />}>
          <DemoTable status={5} citas={canceladas!} tipo={tipo} SetCita={SetCita}/>
        </TabPane>
      </Tabs>
      <label htmlFor="">Equipo: </label>
      <Select  style={{width:"100px"}} options={[  {
    value: 1,
    label: "Equipo 1",
  },
  {
    value: 2,
    label: "Equipo 2",
  },
  {
    value: 3,
    label: "Equipo 3",
  },]}></Select>
      <Divider className="header-divider" />
      <Agenda<IEvent>
        startTime={moment("08:00", "HH:mm")}
        endTime={moment("19:00", "HH:mm")}
        interval={moment("00:30", "HH:mm")}
        defaultType="week"
        calendarHeight={"60vh"}
        excludeDays={[Days.Sunday]}
        columns={[...cols]}
        events={[...events]}
        render={(event) => (
          <div style={{ paddingLeft: 10, backgroundColor: "lightblue" }}>{event?.noSolicitud}</div>
        )}
        onDropEvent={(date, event, column) => {
          // date => fecha en la agenda
          // event => evento si se movio directo de la agenda
          // column => valor de la columna si la agenda es por dia
          if (!event) {
            alerts.confirm(
              "Agendar cita",
              `Deseas agendar una cita el ${date.format(
                "DD [de] MMM [del] YYYY"
              )} en el horario ${date.format("hh:mm a")}`,
              async () => {
                console.log(date,"date");
                if(tipo=="laboratorio"){
                  var cita = await getByIdLab(citaSelect?.id!);
                  cita!.fecha = date;
                  cita!.status =2;
                  await updateLab(cita!);
                }else{
                  var cita = await getByIdDom(citaSelect?.id!);
                  cita!.fecha = date;
                  cita!.status =2;
                  await updateDom(cita!);
                }
                //  llamada a la api para crear el evento...
                const newEvent: IEvent = {
                  id: citaSelect?.id!,
                  externalId: column?.id ?? 1,
                  date: date,
                  noSolicitud: citaSelect?.nombre!,
                };
                setEvents((prev) => [...prev, newEvent]);
              }
            );
          } else {
            alerts.confirm(
              "Mover cita",
              `Deseas mover la solicitud ${event.noSolicitud} al ${date.format(
                "DD [de] MMM [del] YYYY"
              )} en el horario ${date.format("hh:mm a")}`,
              async () => {
                console.log(date,"date");
                //  llamada a la api para crear el evento...
                if(tipo=="laboratorio"){
                  var cita = await getByIdLab(event!.id.toString());
                  cita!.fecha = date;
                  cita!.status =2;
                  console.log(cita,"cita");
                  await updateLab(cita!);
                }else{
                  var cita = await getByIdDom(event!.id.toString());
                  cita!.fecha = date;
                  cita!.status =2;
                  console.log(cita,"cita");
                  await updateDom(cita!);
                }
                const index = events.findIndex((x) => x.id === event.id);
                if (index > -1) {
                  const newEvent: IEvent = {
                    ...event,
                    externalId: column?.id ?? event.externalId,
                    date: date,
                  };
                  const _events = [...events];
                  _events[index] = newEvent;
                  setEvents(_events);
                }
              }
            );
          }
        }}
      />
    </div>
  );
};

export default observer(AppointmentCalendar);


