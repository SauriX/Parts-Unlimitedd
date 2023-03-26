import { PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import { IOptionsReport } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { reports } from "../../app/util/catalogs";
import "./css/report.less";
import { reportType } from "./utils";

type ReportHeaderProps = {
  handleDownload: () => Promise<void>;
};

const ReportHeader: FC<ReportHeaderProps> = ({ handleDownload }) => {
  const { reportStore } = useStore();
  const {
    currentReport,
    filter,
    setCurrentReport,
    getByFilter,
    getByChart,
  } = reportStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = async (
    _: string,
    options: IOptionsReport | IOptionsReport[]
  ) => {
    if (options) {
      const value = (options as IOptionsReport).value!.toString() as reportType;
      setCurrentReport(value);
      searchParams.set("report", value!);
      await getByFilter(value!, filter);
      if (
        value === "contacto" ||
        value == "estudios" ||
        value == "urgentes" ||
        value == "empresa" ||
        value === "medicos-desglosado" ||
        value == "canceladas" ||
        value == "cargo" ||
        value == "presupuestos" ||
        value == "maquila_interna" ||
        value == "maquila_externa"
      ) {
        await getByChart(value, filter);
      }
    } else {
      setCurrentReport(undefined);
      searchParams.delete("report");
    }
    setSearchParams(searchParams);
  };

  return (
    <Fragment>
      <>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle
              title={
                currentReport == "corte_caja"
                  ? "Corte de caja"
                  : currentReport == "indicadores"
                  ? "Indicadores"
                  : "Reportes"
              }
              image={
                currentReport == "corte_caja"
                  ? "registradora"
                  : currentReport == "indicadores"
                  ? "indicadores"
                  : "grafico"
              }
            />
          }
          className="header-container"
          extra={[
            currentReport && (
              <DownloadIcon key="download" onClick={handleDownload} />
            ),
            <Select
              key="reports"
              showSearch
              placeholder="Reporte"
              optionFilterProp="children"
              defaultValue={searchParams.get("report")}
              onChange={handleChange}
              filterOption={(input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
              style={{ width: 180, textAlign: "left" }}
              options={reports}
            ></Select>,
          ]}
        ></PageHeader>
      </>
    </Fragment>
  );
};

export default observer(ReportHeader);
