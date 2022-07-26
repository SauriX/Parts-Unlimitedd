import { Divider, Table, Tabs, Tooltip, Typography } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { PlusCircleOutlined, CalendarOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Agenda from "../app/common/agenda/Agenda";
import moment from "moment";
import { getDefaultColumnProps, IColumns, ISearch } from "../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../app/util/window";
import IconButton from "../app/common/button/IconButton";
import alerts from "../app/util/alerts";
import { Days, IAgenda, IAgendaColumn } from "../app/common/agenda/utils";
import { v4 as uuid } from "uuid";
import AppointmentCalendar from "../components/appointment/apointmenCalendar";
import ApointmenHeader from "../components/appointment/apointmenHeader";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";


const Appointment = () => {
  const [printing, setPrinting] = useState(false);
  const [accessing, setAccessing] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { appointmentStore } = useStore();
  const {   access,   exportForm,sucursal,search,exportList  } =appointmentStore ; 
const [tipo,SetTipo]=useState(searchParams.get("type"));
  const componentRef = useRef<any>();
const handleDownload = async () => {
  
  setPrinting(true);

   var succes= await exportList(search);
  if(succes){
    setPrinting(false);
  } 
};
useEffect(()=>{SetTipo(searchParams.get("type")); console.log("entro")},[searchParams.get("type")]);

const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  onBeforeGetContent: () => {
    setPrinting(true);
  },
  onAfterPrint: () => {
    setPrinting(false);
  },
});
  return(
    <Fragment>
      <ApointmenHeader handlePrint={handlePrint} handleList={handleDownload} tipo={tipo!}></ApointmenHeader>
      <Divider className="header-divider" />
      <AppointmentCalendar componentRef={componentRef} printing={printing}></AppointmentCalendar>
    </Fragment>
  );
}
export default Appointment;

