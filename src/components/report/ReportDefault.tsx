import React, { FC } from "react";
import { IOptionsReport } from "../../app/models/shared";
import { observer } from "mobx-react-lite";
import ReportFormat from "./type/expediente/ReportFormat";
import PruebaFormat from "./type/prueba/PruebaFormat";
import ComponentGraphic from "./Component/ExpedienteComponents/ComponentGraphic";

type ReportDefaultProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  report: IOptionsReport | undefined;
};

const ReportDefault: FC<ReportDefaultProps> = ({ componentRef, printing, report }) => {
  return !report ? null : report.type === "expediente" ? (
    <ReportFormat
      componentRef={componentRef}
      printing={printing}
      reportName={report.value.toString()}
    />
  ) : report.type === "prueba" ? (
    <PruebaFormat
      componentRef={componentRef}
      printing={printing}
      reportName={report.value.toString()}
    />
  // ) : report.type === "Estadistica" ? (
  //   <PruebaFormat
  //     componentRef={componentRef}
  //     printing={printing}
  //     reportName={report.value.toString()}
  //   />
//   ) : report.type === "dimension" ? (
//     <CatalogDimensionTable componentRef={componentRef} printing={printing} />
  ) : null;
};

export default observer(ReportDefault);
