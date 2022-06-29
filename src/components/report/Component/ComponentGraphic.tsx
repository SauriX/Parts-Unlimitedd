import { observer } from "mobx-react-lite";
import { FC, Fragment, useState } from "react";
import { useStore } from "../../../app/stores/store";
import ReactECharts from 'echarts-for-react';
import { Divider, PageHeader } from "antd";
import HeaderTitle from "../../../app/common/header/HeaderTitle";

type CompGrahicProps = {
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
};
const CompGraphic: FC<CompGrahicProps> = ({componentRef, printing}) => {
    // const { optionStore} = useStore();
    // const {  } = optionStore;
    // const [loading, setLoading] = useState(false);
    

    const options = {
        grid: { top: 8, right: "16%", bottom: 24, left: 36 },
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
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };

      const GraphicPrint = () => {
        return (
            <div 
            ref={componentRef}>
                <PageHeader
                    ghost={false}
                    title={<HeaderTitle title="Estadística de expedientes" image="Lealtad" />}
                    className="header-container"
                ></PageHeader>
                <Divider className="header-divider" />
                <div style={{ display: "none" }}>{<ReportGraphic />} </div>
            </div>
            
        );
    };
    
      const ReportGraphic = () => {
        return (
            <div 
            ref={componentRef}>
                <ReactECharts option={options} />;
            </div>
            
        );
    };
    
      return (
        <Fragment>
            <div style={{ display: "none" }}>{<ReportGraphic />} </div>
            <div style={{ display: "none" }}>{<GraphicPrint />} </div>
        </Fragment>
    );

    

    
}
export default observer(CompGraphic);
