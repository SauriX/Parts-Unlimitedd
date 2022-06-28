import { Divider, PageHeader, Table } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IColumns, ISearch, getDefaultColumnProps } from "../../../app/common/table/utils";
import { IReportList } from "../../../app/models/report";
import { useStore } from "../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import ReactECharts from 'echarts-for-react';
import optionStore from "../../../app/stores/optionStore";

type CompExpedienteProps = {
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
};

const CompExpediente: FC<CompExpedienteProps> = ({componentRef, printing}) => {
    const { reportStore ,optionStore} = useStore();
    const {
        DeliveryOptions,
        getDeliveryOptions,
      } = optionStore;
    const [loading, setLoading] = useState(false);
    const { width: windowWidth } = useWindowDimensions();
    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
    });
    
    const {reports } = reportStore;
    useEffect(() => {
        getDeliveryOptions();
      }, [getDeliveryOptions]);
     //TABLAA
    //  const options = {
    //     grid: { top: 8, right: "16%", bottom: 24, left: 36 },
    //     xAxis: {
    //       type: 'category',
    //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //     },
    //     yAxis: {
    //       type: 'value',
    //       alignWithLabel: true
    //     },
    //     series: [
    //       {
    //         data: [5, 10, 15, 20, 30, 40, 50],
    //         type: 'bar',
    //         smooth: true,
    //       },
    //     ],
    //     tooltip: {
    //       trigger: 'axis',
    //     },
    //   };

    
    const columns: IColumns<IReportList> = [
        {
            ...getDefaultColumnProps("nombre", "Nombre", {
                searchState,
                setSearchState,
                width: "15%",
                minWidth: 150,
                windowSize: windowWidth,
            }),
        },
        {
            ...getDefaultColumnProps("expediente", "Expediente", {
                searchState,
                setSearchState,
                width: "10%",
                minWidth: 150,
                windowSize: windowWidth,
            }),
        },
        {
            ...getDefaultColumnProps("visitas", "Visitas", {
                searchState,
                setSearchState,
                width: "8%",
                minWidth: 150,
                windowSize: windowWidth,
            }),
        },
        
    ];
    const ReportTablePrint = () => {
        return (
            <div 
            ref={componentRef}>
                <PageHeader
                    ghost={false}
                    title={<HeaderTitle title="Estadística de expedientes" image="Lealtad" />}
                    className="header-container"
                ></PageHeader>
                <Divider className="header-divider" />
                <Table<IReportList>
                    size="large"
                    rowKey={(record) => record.id}
                    columns={columns.slice(0, 3)}
                    pagination={false}
                    dataSource={[...reports]}
                />
                {/* <ReactECharts option={options} />; */}
            </div>
            
        );
    };

    // const ReportGraphic = () => {
    //     return (
    //         <div 
    //         ref={componentRef}>
    //             <ReactECharts option={options} />;
    //         </div>
            
    //     );
    // };

    return (
        <Fragment>
            <Table<IReportList>
                loading={loading || printing}
                size="large"
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={[...reports]}
                sticky
                // scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
            />
            <div style={{ display: "none" }}>{<ReportTablePrint />}</div>
            {/* <ReactECharts option={options} />; */}
        </Fragment>
    );

    
}
export default observer(CompExpediente);