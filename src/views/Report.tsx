import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import ReportBody from "../components/report/ReportBody";
import ReportHeader from "../components/report/ReportHeader";

const Report = () => {
  const { reportStore } = useStore();
  const { scopes, filter, printPdf, setCurrentReport, clearScopes, access } = reportStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const report = searchParams.get("report");
    if (report) {
      await printPdf(report, filter);
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
    setCurrentReport(searchParams.get("report") ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
