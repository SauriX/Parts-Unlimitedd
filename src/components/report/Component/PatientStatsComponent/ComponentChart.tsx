import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import ReactECharts from "echarts-for-react";
import { Divider, PageHeader, Row } from "antd";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import ComponentPatientStats from "./ComponentPatientStats";

type CompChartProps = {
  printing: boolean;
};

const CompChart: FC<CompChartProps> = ({ printing }) => {
  const { patientStatisticStore } = useStore();
  const { getBranchByCount } = patientStatisticStore;
  const [loading, setLoading] = useState(false);
  const { statsreport } = patientStatisticStore;

  useEffect(() => {
    const readStatsReport = async () => {
      setLoading(true);
      await getBranchByCount();
      setLoading(false);
      getBranchByCount();
    };
    if (statsreport.length == 0) {
      readStatsReport();
    }
  }, []);

  const options = {
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      width: "auto",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: statsreport.map((x) => x.solicitado),
    },
    yAxis: {
      type: "value",
      alignWithLabel: false,
    },
    series: [
      {
        data: statsreport.map((x) => x.monto),
        type: "bar",
        barWidth: "60%",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  const ChartPrint = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle
              title="Estadística de Pacientes"
              image="Reportes"
            />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        {printing && (
          <ComponentPatientStats printing={false}></ComponentPatientStats>
        )}
        <Divider className="header-divider" />
        <ReactECharts option={options} />
      </div>
    );
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "20px" }}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle title="Estadística de Pacientes" image="Reportes" />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <ReactECharts option={options} />
      </div>
    </Fragment>
  );
};

export default observer(CompChart);
