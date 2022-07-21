import { observer } from "mobx-react-lite";
import { IReportData } from "../../app/models/report";
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
      />
    );
  } else if (report === "estadistica") {
    return (
      <ReportChart<IReportData>
        data={data as IReportData[]}
        serieX={"paciente"}
        series={[
          { title: "Solicitudes", dataIndex: "noSolicitudes" },
          { title: "Total", dataIndex: "total" },
        ]}
      />
    );
  } else if (report === "medicos") {
    return (
      <ReportChart<IReportData>
        data={data as IReportData[]}
        serieX={"medico"}
        series={[
          { title: "Total", dataIndex: "total" },
          { title: "Solicitudes", dataIndex: "noSolicitudes" },
          { title: "Pacientes", dataIndex: "noPacientes" },
        ]}
      />
    );
  }

  return null;
};

export default observer(ReportChartSelector);
