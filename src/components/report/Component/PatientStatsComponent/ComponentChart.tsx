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
  const { getByName } = patientStatisticStore;
  const [loading, setLoading] = useState(false);
  const { statsreport } = patientStatisticStore;

  useEffect(() => {
    const readStatsReport = async () => {
      setLoading(true);
      await getByName();
      setLoading(false);
      getByName();
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
    legend: {
      data: ['Solicitudes', 'Total']
    },
    xAxis: {
      type: "category",
      data: statsreport.map((x) => x.nombrePaciente),
      axisLabel: {interval: 0, rotate: 30},
    },
    yAxis: {
      type: "value",
      alignWithLabel: false,
    },
    series: [
      {
        name: 'Solicitudes',
        data: statsreport.map((x) => x.solicitudes),
        emphasis: {
          focus: 'series'
        },
        label: {show: true},
        type: "bar",
        smooth: true,
      },
      {
        name: 'Total',
        data: statsreport.map((x) => x.total),
        emphasis: {
          focus: 'series'
        },
        label: {show: true},
        type: "bar",
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
