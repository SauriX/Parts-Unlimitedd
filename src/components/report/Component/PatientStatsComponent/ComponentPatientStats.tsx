import { Divider, PageHeader, Statistic, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { IColumns, ISearch, getDefaultColumnProps } from "../../../../app/common/table/utils";
import { IPatientStatisticList } from "../../../../app/models/patient_statistic";
import { useStore } from "../../../../app/stores/store";
import useWindowDimensions from "../../../../app/util/window";

type CompPatientStatsProps = {
  printing: boolean;
};

const CompPatientStats: FC<CompPatientStatsProps> = ({ printing }) => {
  return <div></div>;
  // const { patientStatisticStore, optionStore } = useStore();
  // const { getByName } = patientStatisticStore;
  // const { getDeliveryOptions } = optionStore;
  // const [loading, setLoading] = useState(false);
  // const { width: windowWidth } = useWindowDimensions();
  // const [searchState, setSearchState] = useState<ISearch>({
  //   searchedText: "",
  //   searchedColumn: "",
  // });

  // const {  } = patientStatisticStore;
  // useEffect(() => {
  //   getDeliveryOptions();
  // }, [getDeliveryOptions]);

  // useEffect(() => {
  //   const readStatsReport = async () => {
  //     setLoading(true);
  //     await getByName();
  //     setLoading(false);
  //     getByName();
  //   };
  //   if (statsreport.length == 0) {
  //     readStatsReport();
  //   }
  // }, []);

  // const columns: IColumns<IPatientStatisticList> = [
  //   {
  //     ...getDefaultColumnProps("nombrePaciente", "Nombre del Paciente", {
  //       searchState,
  //       setSearchState,
  //       width: '45%',
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  //   {
  //     ...getDefaultColumnProps("solicitudes", "Solicitudes", {
  //       searchState,
  //       setSearchState,
  //       width: '30%',
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  //   {
  //     ...getDefaultColumnProps("total", "Total Solicitudes", {
  //       searchState,
  //       setSearchState,
  //       width: '30%',
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //     render: (value) => ((value).toLocaleString('es-MX', {
  //       style: 'currency',
  //       currency: 'MXN',
  //     })),
  //   },
  // ];

  // let lenReport = statsreport.length - 1;
  // if(lenReport < 0){
  //   lenReport = 0;
  // }

  // return (
  //   <div style={{ marginBottom: "20px" }}>
  //     <PageHeader
  //       ghost={false}
  //       title={<HeaderTitle title="Estadística de Pacientes" image="Reportes"/>}
  //       className="header-container"
  //     ></PageHeader>
  //     <Divider className="header-divider" />
  //     <Table<IPatientStatisticList>
  //       loading={loading}
  //       rowKey={(record) => record.id}
  //       columns={columns.slice(0, 3)}
  //       pagination={false}
  //       dataSource={[...statsreport]}
  //       scroll={{ y: 200 }}
  //       rowClassName={(item) => item.nombrePaciente === "Total"? "Resumen Total": ""}
  //     />
  //     <div style={{textAlign: 'right'}}>
  //       <Tag color="lime"> {lenReport} Registros</Tag>
  //     </div>
  //   </div>
  // );
};

export default observer(CompPatientStats);
