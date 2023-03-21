import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import ReportBody from "../components/report/ReportBody";
import ReportHeader from "../components/report/ReportHeader";
import { reportType } from "../components/report/utils";

const Report = () => {
  const { reportStore, cashRegisterStore, indicatorsStore } = useStore();
  const { scopes, filter, printPdf, setCurrentReport, clearScopes, access } =
    reportStore;
  const { printPdf: cashPdf, filter: cashFilter } = cashRegisterStore;
  const { exportList, filter: indicatorFilter } = indicatorsStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const report = searchParams.get("report");
    if (report == "corte_caja") {
      await cashPdf(cashFilter);
    } else if (report == "indicadores") {
      await exportList(indicatorFilter);
    } else {
      await printPdf(report!, filter);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    setCurrentReport((searchParams.get("report") as reportType) ?? undefined);
  }, []);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <ReportHeader handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <ReportBody printing={loading} />
    </Fragment>
  );
};

export default observer(Report);
