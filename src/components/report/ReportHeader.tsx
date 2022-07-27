import { PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { IOptionsReport } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { reports } from "../../app/util/catalogs";
import "./css/index.css";

type ReportHeaderProps = {
  handleDownload: () => Promise<void>;
};

const ReportHeader: FC<ReportHeaderProps> = ({ handleDownload }) => {
  const { reportStore } = useStore();
  const { currentReport, filter, setCurrentReport, getByFilter, getByChart } = reportStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = async (_: string, options: IOptionsReport | IOptionsReport[]) => {
    if (options) {
      const value = (options as IOptionsReport).value!.toString();
      setCurrentReport(value);
      searchParams.set("report", value);
      await getByFilter(value, filter);
      if(value === "contacto" || value == "estudios"){
        await getByChart(value, filter);
      }
    } else {
      setCurrentReport(undefined);
      searchParams.delete("report");
    }

    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Reportes" image="grafico" />}
      className="header-container"
      extra={[
        currentReport && <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
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
