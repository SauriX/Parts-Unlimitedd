import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import ReactECharts from 'echarts-for-react';
import { Divider, PageHeader, Row } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ComponentExpedientes from "./ComponentExpedientes";

type CompGrahicProps = {
    // componentRef: React.MutableRefObject<any>;
    printing: boolean;
};
const CompGraphic: FC<CompGrahicProps> = ({printing}) => {
  const { reportStore } = useStore();
  const { getBranchByCount } = reportStore;
  const [loading, setLoading] = useState(false);
  const {reports } = reportStore;
  // const Expedientes [] = getBranchByCount();

  useEffect(() => {
    const readReport = async () => {
      setLoading(true);
      await getBranchByCount();
      setLoading(false);
      getBranchByCount();
    };

    if (reports.length === 0) {
      readReport();
  }
  }, []);
  
    const options = {
        grid: {  left: '3%',
        right: '4%',
        bottom: '3%',
        width: 'auto',
        containLabel: true },
        xAxis: {
          type: 'category',
          data: reports.map(x=>x.clave) ,
        },
        yAxis: {
          type: 'value',
          alignWithLabel: false
        },
        series: [
          {
            data: reports.map(x=>x.visitas) ,
            type: 'bar',
            barWidth: '60%',
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };

    //   const GraphicPrint = () => {
    //     return (
    //         <div style={{ textAlign: "center" }} >
    //             <PageHeader
    //                 ghost={false}
    //                 title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
    //                 className="header-container"
    //             ></PageHeader>
    //             {/* <Divider className="header-divider" />
    //             <ComponentExpedientes printing={false}></ComponentExpedientes> */}
    //             <Divider className="header-divider" />
    //             <ReactECharts option={options} />
    //         </div>
    //     );
    // };
    
    
    //   return (
    //     <Fragment>
    //         <div style={{ textAlign: "center" }} >
    //             <PageHeader
    //                 ghost={false}
    //                 title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
    //                 className="header-container"
    //             ></PageHeader>
    //             <Divider className="header-divider" />
    //             <div style={{ display: "none" }}>{<GraphicPrint />} </div>
    //             <ReactECharts 
    //             option={options} 
    //             // notMerge={true}
    //             // lazyUpdate={true}
    //             // theme={"theme_name"}
    //             // onChartReady={this.onChartReadyCallback}
    //             // onEvents={EventsDict}
    //             // opts={}
    //               />
    //         </div>
    //     </Fragment>
    // );

    
    const GraphicPrint = () => {
      return (
          <div style={{ textAlign: "center" }} >
              <PageHeader
                  ghost={false}
                  title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
                  className="header-container"
              ></PageHeader>
              <Divider className="header-divider" />
              {printing && < ComponentExpedientes printing={false}></ComponentExpedientes>}
              <Divider className="header-divider" />
              {/* <div style={{ display: "none" }}>{<ReportGraphic />} </div> */}
              <ReactECharts option={options} />
          </div>
      );
  };

  
    return (
      <Fragment>
          <div style={{ textAlign: "center" }} >
              <PageHeader
                  ghost={false}
                  title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
                  className="header-container"
              ></PageHeader>
              <Divider className="header-divider" />
              {/* <div style={{ display: "none" }}>{<ReportGraphic />} </div> */}
              <ReactECharts option={options} />
              {!printing && < ComponentExpedientes printing={false}></ComponentExpedientes>}
          </div>
      </Fragment>
  );

    
}
export default observer(CompGraphic);
