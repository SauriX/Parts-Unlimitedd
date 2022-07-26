import { observer } from "mobx-react-lite";
import ReactECharts from "echarts-for-react";

type ReportChartProps<T> = {
  data: T[];
  serieX: keyof T;
  series: { title: string; dataIndex: keyof T }[];
  axisLabel?: { interval: number; rotate: number };
};

const ReportChart = <T extends unknown>({
  data,
  serieX,
  series,
  axisLabel,
}: ReportChartProps<T>) => {
  const options = {
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      width: "auto",
      containLabel: true,
    },
    legend: {
      data: series.map((x) => x.title),
    },
    xAxis: {
      type: "category",
      data: data.map((x) => (x as any)[serieX]),
      axisLabel: axisLabel,
    },
    yAxis: {
      type: "value",
      alignWithLabel: false,
    },
    series: series.map((x) => ({
      name: x.title,
      data: data.map((d) => (d as any)[x.dataIndex]),
      emphasis: {
        focus: "series",
      },
      label: { show: true },
      type: "bar",
      smooth: true,
    })),
    tooltip: {
      trigger: "axis",
    },
  };

  return <ReactECharts style={{height: 500}} option={options} notMerge />;
};
export default observer(ReportChart);
