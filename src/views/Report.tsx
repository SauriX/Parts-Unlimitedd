import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment,  useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReportHeader from "../components/report/ReportHeader";
import { IOptionsReport } from "../app/models/shared";
import ReportDefault from "../components/report/ReportDefault";

const Report = () => {
  const { reportStore, patientStatisticStore, medicalStatsStore } = useStore();
  const { scopes, access, setCurrentReport,  clearScopes, exportList, printPdf, filtroPDF } = reportStore;
  const {printPdf: printPdfStats, pdfFilter} = patientStatisticStore;
  const {printPdf: printPdfMedical, medicalPdfFilter} = medicalStatsStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IOptionsReport>();
  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });
  const handleDownload = async () => {
    setLoading(true);
    const params = searchParams.get("reports");
    if (params === "expediente"){
      await printPdf(filtroPDF);
    }
    if(params == "estadistica"){
      await printPdfStats(pdfFilter);
    }
    if(params == "medicos"){
      await printPdfMedical(medicalPdfFilter);
    }
    // await printPdf(searchParams.get("report") ?? "", searchParams.get("search") ?? "all");
    setLoading(false);
  };

  // useEffect(() => {
  //   const checkAccess = async () => {
  //     await access();
  //   };

  //   checkAccess();
  // }, [access]);

  useEffect(() => {
    setCurrentReport(searchParams.get("report") ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  // if (!scopes?.acceder) return null;

  return (
    <Fragment>
    <ReportHeader 
        report={report}
        setReport={setReport}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
    <Divider className="header-divider" />
    <ReportDefault  componentRef={componentRef} printing={loading} report={report} />
  </Fragment>
  );
};

export default observer(Report);
