import { PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
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
  const navigate = useNavigate();
  const { reportStore } = useStore();
  const {
    currentReport,
    filter,
    setCurrentReport,
    getByFilter,
    getByChart,
    clearFilter,
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
        value == "descuento" ||
        value == "cargo" ||
        value == "maquila_interna" ||
        value == "maquila_externa"
      ) {
        await getByChart(value, filter);
      }
      else if (value == "corte_caja"){
        navigate("cash");
      }
    } else {
      setCurrentReport(undefined);
      searchParams.delete("report");
    }
    clearFilter();
    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Reportes" image="grafico" />}
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
  );
};

export default observer(ReportHeader);
