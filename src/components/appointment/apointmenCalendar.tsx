import { Button, Col, Divider, Input, Row, Select, Table, Tabs, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { PlusCircleOutlined, CalendarOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
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

const AppointmentCalendar = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [tipo, seTipo] = useState("laboratorio");
  let navigate = useNavigate();
  return (
    <>
        <div>
            <Row>
            <Col md={10} sm={12}>
                <label htmlFor="">Nombre/Clave: </label>
                <Input   style={{width:"350px" , marginBottom:"30px"}} type={"text"} placeholder={""}></Input>
                <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{}}>Buscar</Button>
            </Col>
            <Col md={5} sm={12}>
            <label htmlFor="">Tipo de cita: </label>
                <Select value={tipo} style={{width:"150px" , marginBottom:"30px"}} onChange={(value)=>{seTipo(value)}} options={[{label:"Laboratorio",value:"laboratorio"},{label:"Domicilio",value:"domicilio"}]}></Select>
            </Col>
            <Col md={7} sm={12}>
            <DateRangeInput
                    formProps={{ label: "Fechas", name: "fecha" }}
                    
              /></Col>
            <Col md={2} sm={12}>
            <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>{navigate(`/${views.appointment}/new?type=${tipo}&mode=edit`);}}>Generar</Button>
            </Col>

            </Row>
        </div>
      <Tabs tabPosition="left">
        <TabPane key="1" tab={<TabInfo title="Generadas" icon={<PlusCircleOutlined />} />}>
          <DemoTable />
        </TabPane>
        <TabPane key="2" tab={<TabInfo title="Agendadas" icon={<CalendarOutlined />} />}>
          <DemoTable />
        </TabPane>
        {tipo==="laboratorio"&&
        <TabPane key="3" tab={<TabInfo title="Listas para scan" icon={<CalendarOutlined />} />}>
          <DemoTable />
        </TabPane>}
        <TabPane key="4" tab={<TabInfo title="Canceladas" icon={<CloseCircleOutlined />} />}>
          <DemoTable />
        </TabPane>
      </Tabs>
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
                //  llamada a la api para crear el evento...
                const newEvent: IEvent = {
                  id: uuid(),
                  externalId: column?.id ?? 1,
                  date: date,
                  noSolicitud: "44555765",
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
                //  llamada a la api para crear el evento...
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
    </>
  );
};

export default AppointmentCalendar;

const demoData = [
  {
    noSolicitud: "44555765",
    fecha: new Date(),
    direccion: "Av. Ruiz Cortinex, Valle Verde, Monterrey, Nuevo León",
    nombre: "Jose Ramirez",
    edad: 30,
    sexo: "Masculino",
  },
];

const DemoTable = () => {
  const { width: windowWidth } = useWindowDimensions();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<any> = [
    {
      ...getDefaultColumnProps("noSolicitud", "Solicitud de cita", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => <Link draggable>{value}</Link>,
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      ...getDefaultColumnProps("direccion", "Dirección", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => (
        <Tooltip title={value}>
          <Text style={{ maxWidth: 180 }} ellipsis={true}>
            {value}
          </Text>
        </Tooltip>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("info", "Datos", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (_, data) => <div>{`${data.edad} años, ${data.sexo.substring(0, 1)}`}</div>,
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar reactivo"
          icon={<EditOutlined />}
          onClick={() => {
            // navigate(`/${views.reagent}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  return (
    <Table<any>
      size="small"
      rowKey={(record) => record.noSolicitud}
      columns={columns}
      dataSource={[...demoData]}
      pagination={false}
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
  );
};
