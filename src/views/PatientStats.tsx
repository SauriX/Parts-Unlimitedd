import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import PatientStatistic from "../app/api/patient_statistic";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ReportHeader from "../components/report/ReportHeader";
import { IOptionsReport } from "../app/models/shared";

const PatientStats = () => {
  return <div></div>;
  // const { patientStatisticStore } = useStore();
  // const { scopes, access, setCurrentReport, clearScopes, exportList, printPdf } =
  //   patientStatisticStore;

  // const [searchParams] = useSearchParams();

  // const [loading, setLoading] = useState(false);
  // const [statsreport, setStatsReport] = useState<IOptionsReport>();
  // const componentRef = useRef<any>();

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onBeforeGetContent: () => {
  //     setLoading(true);
  //   },
  //   onAfterPrint: () => {
  //     setLoading(false);
  //   },
  // });

  // const handleDownload = async () => {
  //   setLoading(true);
  //   await printPdf();
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   setCurrentReport(searchParams.get("report") ?? undefined);
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     clearScopes();
  //   };
  // }, [clearScopes]);

  // return (
  //   <Fragment>
  //     <ReportHeader
  //       report={statsreport}
  //       setReport={setStatsReport}
  //       handlePrint={handlePrint}
  //       handleDownload={handleDownload}
  //     />
  //     <Divider className="header-divider" />
  //     <ReportDefault
  //       componentRef={componentRef}
  //       printing={loading}
  //       report={statsreport}
  //     />
  //   </Fragment>
  // );
};

export default observer(PatientStats);
