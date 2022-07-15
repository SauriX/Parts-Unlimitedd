import { Divider, Table, Tabs, Tooltip, Typography } from "antd";
import React, { Fragment, useRef, useState } from "react";
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


const Appointment = () => {
  const [printing, setPrinting] = useState(false);
  const [accessing, setAccessing] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const componentRef = useRef<any>();
const handleDownload = async () => {
  
  setPrinting(true);
/*   var succes= await exportList(searchParams.get("search") ?? "all");
  if(succes){
    setPrinting(false);
  } */
};
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
      <ApointmenHeader handlePrint={handlePrint} handleList={handleDownload}></ApointmenHeader>
      <Divider className="header-divider" />
      <AppointmentCalendar></AppointmentCalendar>
    </Fragment>
  );
}
export default Appointment;

