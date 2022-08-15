import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import ReportFilter from "./ReportFilter";
import { Col, PageHeader, Row, Spin } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import {
  getColumns,
  getExpandableConfig,
  getInputs,
  getReportConfig,
} from "./utils";
import { IReportData } from "../../app/models/report";
import { IColumns, ISearch } from "../../app/common/table/utils";
import ReportTable from "./ReportTable";
import ReportChartSelector from "./ReportChartSelector";
import { ExpandableConfig } from "antd/lib/table/interface";

type ReportDefaultProps = {
  printing: boolean;
};

const ReportBody: FC<ReportDefaultProps> = ({ printing }) => {
  const { reportStore } = useStore();
  const { reportData, chartData, currentReport, filter } = reportStore;
  const [loading, setLoading] = useState(false);
  const [dataChart, setDataChart] = useState<any[]>([]);

  const [inputs, setInputs] = useState<
    (
      | "sucursal"
      | "fecha"
      | "medico"
      | "metodoEnvio"
      | "compañia"
      | "urgencia"
      | "tipoCompañia"
    )[]
  >([]);
  const [title, setTitle] = useState<string>();
  const [image, setImage] = useState<string>();
  const [expandable, setExpandable] = useState<ExpandableConfig<IReportData>>();
  const [summary, setSummary] = useState<boolean>();
  const [hasFooterRow, setHasFooterRow] = useState<boolean>();
  const [columns, setColumns] = useState<IColumns<IReportData>>([]);
  const [showChar, setShowChart] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    if (currentReport) {
      setInputs(getInputs(currentReport));
      const data = getReportConfig(currentReport);
      setTitle(data.title);
      setImage(data.image);
      setHasFooterRow(data.hasFooterRow);
      setSummary(data.summary);
      console.log(getInputs(currentReport));
    } else {
      setInputs([]);
      setTitle("");
      setImage("");
      setHasFooterRow(false);
      setSummary(false);
    }
  }, [currentReport]);

  useEffect(() => {
    if (currentReport) {
      setColumns(getColumns(currentReport, searchState, setSearchState));
      setExpandable(getExpandableConfig(currentReport));
    } else {
      setColumns([]);
      setExpandable(undefined);
    }
  }, [currentReport, searchState, filter]);

  useEffect(() => {
    if (
      currentReport == "contacto" ||
      currentReport == "estudios" ||
      currentReport == "urgentes" ||
      currentReport == "empresa" ||
      currentReport == "canceladas" ||
      currentReport == "descuento" ||
      currentReport == "cargo" ||
      currentReport == "medicos-desglosado"
    ) {
      setDataChart(chartData);
    } else {
      console.log("reporte data");
      setDataChart(reportData);
    }
  }, [currentReport, chartData, reportData]);

  if (!currentReport || !title || !image) return null;

  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <ReportFilter input={inputs} setShowChart={setShowChart} />
        </Col>
        <Col span={24}>
          <PageHeader
            ghost={false}
            title={<HeaderTitle title={title} image={image} />}
            className="header-container"
          />
        </Col>
        <Col span={24}>
          {!showChar ? (
            <ReportTable
              columns={columns}
              data={reportData}
              loading={false}
              hasFooterRow={hasFooterRow}
              expandable={expandable}
              summary={summary}
            />
          ) : (
            <ReportChartSelector report={currentReport} data={dataChart} />
          )}
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(ReportBody);
