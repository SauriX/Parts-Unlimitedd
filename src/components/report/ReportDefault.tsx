import React, { FC } from "react";
import { IOptionsReport } from "../../app/models/shared";
import { observer } from "mobx-react-lite";
import ReportFormat from "./type/expediente/ReportFormat";
import PatientStatsForm from "./type/patient_stats/PatientStatsFormat";
import MedicalStatsFormat from "./type/medical_stats/MedicalStatsFormat";

type ReportDefaultProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  report: IOptionsReport | undefined;
};

const ReportDefault: FC<ReportDefaultProps> = ({
  componentRef,
  printing,
  report,
}) => {
  return !report ? null : report.type === "expediente" ? (
    <ReportFormat
      componentRef={componentRef}
      printing={printing}
      reportName={report.value.toString()}
    />
  ) : report.type === "estadistica" ? (
    <PatientStatsForm
      componentRef={componentRef}
      printing={printing}
      reportName={report.value.toString()}
    />
  ) : report.type === "medicos" ? (
    <MedicalStatsFormat
      componentRef={componentRef}
      printing={printing}
      reportName={report.value.toString()}
    />
  ) : null;
};

export default observer(ReportDefault);
