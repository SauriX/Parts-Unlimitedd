import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import ReportFilter from "./ReportFilter";
import { Col, PageHeader, Row } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { getColumns, getInputs, getTitleAndImage } from "./utils";
import { IReportData } from "../../app/models/report";
import { IColumns, ISearch } from "../../app/common/table/utils";
import ReportTable from "./ReportTable";
import ReportChart from "./ReportChart";
import ReportChartSelector from "./ReportChartSelector";

type ReportDefaultProps = {
  printing: boolean;
};

const ReportBody: FC<ReportDefaultProps> = ({ printing }) => {
  const { reportStore } = useStore();
  const { reportData, currentReport } = reportStore;

  const [inputs, setInputs] = useState<("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[]>([]);
  const [title, setTitle] = useState<string>();
  const [image, setImage] = useState<string>();
  const [columns, setColumns] = useState<IColumns<IReportData>>([]);
  const [showChar, setShowChart] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    if (currentReport) {
      setInputs(getInputs(currentReport));
      const data = getTitleAndImage(currentReport);
      setTitle(data.title);
      setImage(data.image);
    } else {
      setInputs([]);
      setTitle("");
      setImage("");
    }
  }, [currentReport]);

  useEffect(() => {
    if (currentReport) {
      setColumns(getColumns(currentReport, searchState, setSearchState));
    } else {
      setColumns([]);
    }
  }, [currentReport, searchState]);

  if (!currentReport || !title || !image) return null;

  return (
    <Row>
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
          <ReportTable columns={columns} data={reportData} loading={false} />
        ) : (
          <ReportChartSelector report={currentReport} data={reportData} />
        )}
      </Col>
    </Row>
  );
};

export default observer(ReportBody);
