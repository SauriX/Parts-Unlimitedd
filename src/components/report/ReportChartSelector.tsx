import { observer } from "mobx-react-lite";
import { IReportContactData, IReportData } from "../../app/models/report";
import ReportChart from "./ReportChart";

type ReportChartSelectorProps = {
  report: string;
  data: any[];
};

const ReportChartSelector = ({ report, data }: ReportChartSelectorProps) => {
  if (report === "expediente") {
    return (
      <ReportChart<IReportData>
        data={data as IReportData[]}
        serieX={"expediente"}
        series={[{ title: "Solicitudes", dataIndex: "noSolicitudes" }]}
        axisLabel={{interval: 0, rotate: 0}}
      />
    );
  } else if (report === "estadistica") {
    return (
      <ReportChart<IReportData>
        data={data as IReportData[]}
        serieX={"paciente"}
        series={[
          { title: "Solicitudes", dataIndex: "noSolicitudes" },
          { title: "Total de Solicitudes", dataIndex: "total" },
        ]}
        axisLabel={{interval: 0, rotate: 30}}
      />
    );
  } else if (report === "medicos") {
    return (
      <ReportChart<IReportData>
        data={data as IReportData[]}
        serieX={"claveMedico"}
        series={[
          { title: "Total", dataIndex: "total" },
          { title: "Solicitudes", dataIndex: "noSolicitudes" },
          { title: "Pacientes", dataIndex: "noPacientes" },
        ]}
        axisLabel={{interval: 0, rotate: 0}}
      />
    );
  } else if (report === "contacto") {
    return (
      <ReportChart<IReportContactData>
        data={data as IReportContactData[]}
        serieX={"fecha"}
        series={[
          { title: "Solicitudes", dataIndex: "solicitudes" },
          { title: "WhatsApp", dataIndex: "cantidadTelefono" },
          { title: "Correo", dataIndex: "cantidadCorreo" },
          { title: "Total Medio de Contacto", dataIndex: "total" },
        ]}
        axisLabel={{interval: 0, rotate: 0}}
      />
    );
  }

  return null;
};

export default observer(ReportChartSelector);
