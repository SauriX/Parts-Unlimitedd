import { Divider } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import AppointmentCalendar from "../components/appointment/apointmenCalendar";
import ApointmenHeader from "../components/appointment/apointmenHeader";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";

const Appointment = () => {
  const [printing, setPrinting] = useState(false);
  const [searchParams] = useSearchParams();
  const { appointmentStore } = useStore();
  const { search, exportList } = appointmentStore;
  const [tipo, SetTipo] = useState(searchParams.get("type"));
  const componentRef = useRef<any>();
  const handleDownload = async () => {
    setPrinting(true);

    var succes = await exportList(search);
    if (succes) {
      setPrinting(false);
    }
  };
  useEffect(() => {
    SetTipo(searchParams.get("type"));
  }, [searchParams.get("type")]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });
  return (
    <Fragment>
      <ApointmenHeader
        handlePrint={handlePrint}
        handleList={handleDownload}
        tipo={tipo!}
      ></ApointmenHeader>
      <Divider className="header-divider" />
      <AppointmentCalendar
        componentRef={componentRef}
        printing={printing}
      ></AppointmentCalendar>
    </Fragment>
  );
};
export default Appointment;
