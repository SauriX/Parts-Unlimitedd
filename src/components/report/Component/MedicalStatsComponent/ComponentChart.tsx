import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import ReactECharts from "echarts-for-react";
import { Divider, PageHeader, Row } from "antd";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import ComponentMedicalStats from "./ComponentMedicalStats";

type CompChartProps = {
  printing: boolean;
};

const CompChart: FC<CompChartProps> = () => {
  const { medicalStatsStore } = useStore();
  const { getByDoctor } = medicalStatsStore;
  const [loading, setLoading] = useState(false);
  const { statsreport } = medicalStatsStore;

  useEffect(() => {
    const readStatsReport = async () => {
      setLoading(true);
      await getByDoctor();
      setLoading(false);
      getByDoctor();
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
      data: ["Importe", "Solicitudes", "Pacientes"],
    },
    xAxis: {
      type: "category",
      data: statsreport.map((x) => x.claveMedico),
      axisLabel: { interval: 0 },
    },
    yAxis: {
      type: "value",
      alignWithLabel: false,
    },
    series: [
        {
            name: "Importe",
            data: statsreport.map((x) => x.total),
            emphasis: {
                focus: "series",
            },
            label: { show: true },
            type: "bar",
            smooth: true,
        },
        {
          name: "Solicitudes",
          data: statsreport.map((x) => x.solicitudes),
          emphasis: {
            focus: "series",
          },
          label: { show: true },
          type: "bar",
          smooth: true,
        },
        {
          name: "Pacientes",
          data: statsreport.map((x) => x.pacientes),
          emphasis: {
            focus: "series",
          },
          label: { show: true },
          type: "bar",
          smooth: true,
        },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "20px" }}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle title="Solicitudes por Médico Condensado" image="doctor" />
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
