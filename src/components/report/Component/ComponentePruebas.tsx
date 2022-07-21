import { Divider, PageHeader, Table } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IColumns, ISearch, getDefaultColumnProps } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { useStore } from "../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
type CompPruebaProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CompPrueba: FC<CompPruebaProps> = ({ componentRef, printing }) => {
  return <div></div>;
  // const { reportStore ,optionStore} = useStore();
  // const {
  //     getDeliveryOptions,
  //   } = optionStore;
  // const [loading] = useState(false);
  // const { width: windowWidth } = useWindowDimensions();
  // const [searchState, setSearchState] = useState<ISearch>({
  //     searchedText: "",
  //     searchedColumn: "",
  // });

  // const {reports } = reportStore;
  // useEffect(() => {
  //     getDeliveryOptions();
  //   }, [getDeliveryOptions]);

  //   const columns: IColumns<IReportList> = [
  //     {
  //         ...getDefaultColumnProps("nombre", "Nombre", {
  //             searchState,
  //             setSearchState,
  //             width: "15%",
  //             minWidth: 150,
  //             windowSize: windowWidth,
  //         }),
  //     },
  //     {
  //         ...getDefaultColumnProps("cantidadDescuento", "Beneficio Aplicado", {
  //             searchState,
  //             setSearchState,
  //             width: "9%",
  //             minWidth: 150,
  //             windowSize: windowWidth,
  //         }),
  //     },
  //     {
  //         ...getDefaultColumnProps("expediente", "Expediente", {
  //             searchState,
  //             setSearchState,
  //             width: "10%",
  //             minWidth: 150,
  //             windowSize: windowWidth,
  //         }),
  //     },
  //     {
  //         ...getDefaultColumnProps("nombre", "Nombre", {
  //             searchState,
  //             setSearchState,
  //             width: "8%",
  //             minWidth: 150,
  //             windowSize: windowWidth,
  //         }),
  //     },
  //     {
  //         ...getDefaultColumnProps("visitas", "Visitas", {
  //             searchState,
  //             setSearchState,
  //             width: "8%",
  //             minWidth: 150,
  //             windowSize: windowWidth,
  //         }),
  //     },

  // ];
  // const ReportTablePrint = () => {
  //     return (
  //         <div
  //         ref={componentRef}>
  //             <PageHeader
  //                 ghost={false}
  //                 title={<HeaderTitle title="Estadística de expedientes" image="Reportes" />}
  //                 className="header-container"
  //             ></PageHeader>
  //             <Divider className="header-divider" />
  //             <Table<IReportList>
  //                 size="small"
  //                 rowKey={(record) => record.id}
  //                 columns={columns.slice(0, 5)}
  //                 pagination={false}
  //                 dataSource={[...reports]}
  //             />
  //         </div>

  //     );
  // };

  // return (
  //     <Fragment>
  //         <Table<IReportList>
  //             loading={loading || printing}
  //             size="small"
  //             rowKey={(record) => record.id}
  //             columns={columns}
  //             dataSource={[...reports]}
  //             sticky
  //             scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
  //         />
  //         <div style={{ display: "none" }}>{<ReportTablePrint />}</div>
  //     </Fragment>
  // );
};
export default observer(CompPrueba);
