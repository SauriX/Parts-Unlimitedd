import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import ReactECharts from 'echarts-for-react';
import { Divider, PageHeader, Row } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import ComponentExpedientes from "./ComponentExpedientes";

type CompGrahicProps = {
    // componentRef: React.MutableRefObject<any>;
    // printing: boolean;
};
const CompGraphic: FC<CompGrahicProps> = ({}) => {
  const { reportStore } = useStore();
  const { getBranchByCount } = reportStore;
  const [loading, setLoading] = useState(false);
  const {reports } = reportStore;

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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
          alignWithLabel: true
        },
        series: [
          {
            data: [5, 10, 15, 20, 30, 40, 50],
            type: 'bar',
            barWidth: '60%',
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };

      const GraphicPrint = () => {
        return (
            <div style={{ textAlign: "center" }} >
                <PageHeader
                    ghost={false}
                    title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
                    className="header-container"
                ></PageHeader>
                <Divider className="header-divider" />
                <ComponentExpedientes></ComponentExpedientes>
                <Divider className="header-divider" />
                {/* <div style={{ display: "none" }}>{<ReportGraphic />} </div> */}
                <ReactECharts option={options} />
            </div>
        );
    };
    
    //   const ReportGraphic = () => {
    //     return (
    //         <div >
    //           <PageHeader
    //                 ghost={false}
    //                 title={<HeaderTitle title="Estadística de expedientes" image="Lealtad" />}
    //                 className="header-container"
    //             ></PageHeader>
    //             <Divider className="header-divider" />
    //             <div style={{ display: "none" }}>{<GraphicPrint />} </div>
    //             <ReactECharts option={options} />
    //         </div>
            
    //     );
    // };
    
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
            </div>
        </Fragment>
    );

    

    
}
export default observer(CompGraphic);
