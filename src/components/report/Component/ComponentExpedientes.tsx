import { Divider, PageHeader, Table } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IColumns, ISearch, getDefaultColumnProps } from "../../../app/common/table/utils";
import { IReportList } from "../../../app/models/report";
import { useStore } from "../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";

type CompExpedienteProps = {
    // componentRef: React.MutableRefObject<any>;
    printing: boolean;
};

const CompExpediente: FC<CompExpedienteProps> = ({
    // componentRef,
    printing,}) => {
    const { reportStore ,optionStore} = useStore();
  const { getBranchByCount } = reportStore;
    const {
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
    
    
    const columns: IColumns<IReportList> = [
        {
            ...getDefaultColumnProps("clave", "Expediente", {
                searchState,
                setSearchState,
                width: "15%",
                minWidth: 150,
                windowSize: windowWidth,
            }),
        },
        {
            ...getDefaultColumnProps("nombre", "Nombre", {
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
    // const FuncionPrueba = () =>{
        
    // }
    // const ReportTablePrint = () => {
    //     return (
    //         <div >
    //             <PageHeader
    //                 ghost={false}
    //                 title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
    //                 className="header-container"
    //             ></PageHeader>
    //             <Divider className="header-divider" />
    //             <Table<IReportList>
    //                 size="small"
    //                 rowKey={(record) => record.id}
    //                 columns={columns.slice(0, 3)}
    //                 pagination={false}
    //                 dataSource={[...reports]}
    //             />
    //         </div>
    //     );
    // };


    // return (
    //     <Fragment>
    //         <div style={{ textAlign: "right" }} >
    //         <PageHeader
    //                 ghost={false}
    //                 title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
    //                 className="header-container"
    //             ></PageHeader>
    //             <Divider className="header-divider" />
    //         <Table<IReportList>
    //             loading={loading }
    //             size="large"
    //             rowKey={(record) => record.id}
    //             columns={columns}
    //             dataSource={[...reports]}
    //             sticky
    //             scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    //         />
    //         <div 
    //         style={{ display: "none" }}
    //         >{<ReportTablePrint />}</div>
    //         </div>
    //     </Fragment>
    // );

    const ReportTablePrint = () => {
        return (
            <div>
            
                <PageHeader
                    ghost={false}
                    title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
                    className="header-container"
                ></PageHeader>
                <Divider className="header-divider" />
                <Table<IReportList>
                    size="small"
                    rowKey={(record) => record.id}
                    columns={columns.slice(0, 3)}
                    pagination={false}
                    dataSource={[...reports]}
                />
                {/* <ReactECharts option={options} />; */}
            </div>
            
        );
    };


    return (
        <Fragment>
            <div style={{ textAlign: "center", height: 100 }} >
                <Divider className="header-divider" />
                {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle title="Catálogo de Lealtades" image="Lealtad" />
              }
              className="header-container"
            ></PageHeader>
          )}
            <Table<IReportList>
                loading={loading}
                size="small"
                rowKey={(record) => record.id}
                columns={columns.slice(0, 3)}
                dataSource={[...reports]}
                sticky
                pagination={false}
                // scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
            />
            <div style={{ display: "none" }}>{<ReportTablePrint />}</div>
            {/* <ReactECharts option={options} />; */}
            </div>
        </Fragment>
    );
    
}
export default observer(CompExpediente);