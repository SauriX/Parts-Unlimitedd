import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Table,
  Tabs,
  Typography,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import Agenda from "../../app/common/agenda/Agenda";
import moment from "moment";
import alerts from "../../app/util/alerts";
import { Days, IAgenda, IAgendaColumn } from "../../app/common/agenda/utils";
import views from "../../app/util/view";
import { useNavigate, useSearchParams } from "react-router-dom";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";

import { useStore } from "../../app/stores/store";
import { IAppointmentList } from "../../app/models/appointmen";

import { observer } from "mobx-react-lite";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { getDefaultColumnProps, IColumns, ISearch } from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
const { Search } = Input;
const { TabPane } = Tabs;
const { Link, Text } = Typography;

interface IEvent extends IAgenda {
  noSolicitud: string;
}


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
  type:"date" | "week"
};
const AppointmentCalendar: FC<ProceedingTableProps> = ({ componentRef,type }) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const { RangePicker } = DatePicker;
  const [events, setEvents] = useState<IEvent[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tipo, seTipo] = useState("laboratorio");
  const [generadas, Setgeneradas] = useState<IAppointmentList[]>();
  const [agedadas, SetAgendadas] = useState<IAppointmentList[]>();
  const [scan, Setscan] = useState<IAppointmentList[]>();
  const [canceladas, Setceladas] = useState<IAppointmentList[]>();
  const { appointmentStore } = useStore();
  const [citaSelect, SetCita] = useState<IAppointmentList>();
  
  const { width: windowWidth } = useWindowDimensions();
  const {
    getAllDom,
    getAllLab,
    sucursales,
    getByIdDom,
    getByIdLab,
    sucursal,
    updateDom,
    updateLab,
    setSearch,
    search,
  } = appointmentStore;
  useEffect(() => {
    const readData = async () => {
      console.log();
      if (tipo == "laboratorio") {
        var citas = await getAllLab(search);
        
        console.log(citas, "cirtas");
        var citasgeneradas = citas?.filter((x) => x.tipo == 1);
        Setgeneradas(citasgeneradas);
        var citasagendadas = citas?.filter((x) => x.tipo == 2);
        citasagendadas?.forEach((x) => {
          console.log(moment(x.fecha),"fecha");
          var newEvent: IEvent = {
            id: x.id,
            externalId: 1,
            date: moment(x.fecha),
            noSolicitud: x.nombre,
          };
          console.log(newEvent, "event");
          setEvents((prev) => [...prev, newEvent]);
        });
        citasagendadas = citasagendadas?.map(x=>({...x,color:"#FFFFFF"}))
        SetAgendadas(citasagendadas);
        var citasscan = citas?.filter((x) => x.tipo == 3);
        Setscan(citasscan);
        var citascance = citas?.filter((x) => x.tipo == 4);
        Setceladas(citascance);
      } else {
        var citas = await getAllDom(search);
        var citasgeneradas = citas?.filter((x) => x.tipo == 1);
        Setgeneradas(citasgeneradas);
        var citasagendadas = citas?.filter((x) => x.tipo == 2);
        SetAgendadas(citasagendadas);
        var citasscan = citas?.filter((x) => x.tipo == 3);
        Setscan(citasscan);
        var citascance = citas?.filter((x) => x.tipo == 4);
        Setceladas(citascance);
      }
    };
    readData();
    console.log(events, "events");
  }, [tipo, getAllDom, getAllLab]);
  const columns: IColumns<IAppointmentList> = [
    {
      ...getDefaultColumnProps("noSolicitud", "Id", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => {
        return {
        	props: {
            style: { background: item.color },
          },
        	children: <div>{value}</div>,
        };
      },
    },   {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => {
        return {
        	props: {
            style: { background: item.color },
          },
        	children: <div>{value}</div>,
        };
      },
    }, {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => {
        return {
        	props: {
            style: { background: item.color },
          },
        	children: <div>{value}</div>,
        };
      },
    },{
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => {
        return {
        	props: {
            style: { background: item.color },
          },
        	children: <div>{value}</div>,
        };
      },
    }, 
    {
      ...getDefaultColumnProps("contacto", "Contacto", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => {
        return {
        	props: {
            style: { background: item.color },
          },
        	children: <div>{value}</div>,
        };
      },
    },

  ];
  const hoverhandle = () =>{
    var citas = agedadas?.map(x=>({...x,color:"#C5E0B4"}));
    SetAgendadas(citas!);
  }
  const overhandle = () =>{
    var citas = agedadas?.map(x=>({...x,color:"#FFFFFF"}));
    SetAgendadas(citas!);
  }
  return (
    <div ref={componentRef}>
      <Row>
        <Col md={type=="date"?14:16}>
            <Agenda<IEvent>
            startTime={moment("08:00", "HH:mm")}
            endTime={moment("19:00", "HH:mm")}
            interval={moment("00:30", "HH:mm")}
            defaultType="date"
            calendarHeight={"60vh"}
            excludeDays={[Days.Sunday]}
            columns={[...cols]}
            events={[...events]}
            render={(event) => (
              <div onMouseOver={()=>{hoverhandle()}} onMouseOut={()=>{overhandle()}}  style={{ paddingLeft: 10, backgroundColor: "lightblue" }}>
                {event?.noSolicitud}
              </div>
            )}
            onDropEvent={(date, event, column) => {

            }}
            showDatePicker={false}
            type={type}
          />
        </Col>
        <Col md={type=="date"?10:8}>
        <Table<any>
      size="small"
      rowKey={(record) => record.noSolicitud}
      columns={columns}
      dataSource={/* [...citas].filter(x=>x.tipo==status) */ agedadas}
      pagination={false}
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
        </Col>
      </Row>

    </div>
  );
};

export default observer(AppointmentCalendar);
