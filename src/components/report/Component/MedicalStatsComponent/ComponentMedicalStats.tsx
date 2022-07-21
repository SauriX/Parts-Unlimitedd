import { Divider, PageHeader, Statistic, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { IColumns, ISearch, getDefaultColumnProps } from "../../../../app/common/table/utils";
import { IMedicalStatsList } from "../../../../app/models/medical_stats";
import { useStore } from "../../../../app/stores/store";
import { moneyFormatter } from "../../../../app/util/utils";
import useWindowDimensions from "../../../../app/util/window";

type CompMedicalStatsProps = {
  printing: boolean;
};

const CompMedicalStats: FC<CompMedicalStatsProps> = () => {
  return <div></div>;
  // const { medicalStatsStore, optionStore } = useStore();
  // const { getByDoctor } = medicalStatsStore;
  // const { getDeliveryOptions } = optionStore;
  // const [loading, setLoading] = useState(false);
  // const { width: windowWidth } = useWindowDimensions();
  // const [searchState, setSearchState] = useState<ISearch>({
  //   searchedText: "",
  //   searchedColumn: "",
  // });

  // const { statsreport } = medicalStatsStore;
  // useEffect(() => {
  //   getDeliveryOptions();
  // }, [getDeliveryOptions]);

  // useEffect(() => {
  //   const readStatsReport = async () => {
  //     setLoading(true);
  //     await getByDoctor();
  //     setLoading(false);
  //     getByDoctor();
  //   };
  //   if (statsreport.length == 0) {
  //     readStatsReport();
  //   }
  // }, []);

  // const columns: IColumns<IMedicalStatsList> = [
  //   {
  //     ...getDefaultColumnProps("claveMedico", "Clave", {
  //       searchState,
  //       setSearchState,
  //       width: "20%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  //   {
  //       ...getDefaultColumnProps("nombreMedico", "Nombre del Médico", {
  //         searchState,
  //         setSearchState,
  //         width: "35%",
  //         minWidth: 150,
  //         windowSize: windowWidth,
  //       }),
  //     },
  //     {
  //       ...getDefaultColumnProps("total", "Importe", {
  //         searchState,
  //         setSearchState,
  //         width: "20%",
  //         minWidth: 150,
  //         windowSize: windowWidth,
  //       }),
  //       render: (value) =>
  //         moneyFormatter.format(value)
  //       // render: (_value, record) =>
  //       //     <ul>
  //       //       <li>{record.pacientes}</li>
  //       //       <li>{record.total}</li>
  //       //     </ul>
  //     },
  //   {
  //     ...getDefaultColumnProps("solicitudes", "Solicitudes", {
  //       searchState,
  //       setSearchState,
  //       width: "20%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  //   {
  //     ...getDefaultColumnProps("pacientes", "No. Pacientes", {
  //       searchState,
  //       setSearchState,
  //       width: "20%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
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
  //       title={
  //         <HeaderTitle title="Solicitudes por Médico Condensado" image="doctor" />
  //       }
  //       className="header-container"
  //     ></PageHeader>
  //     <Divider className="header-divider" />
  //     <Table<IMedicalStatsList>
  //       loading={loading}
  //       rowKey={(record) => record.id}
  //       columns={columns.slice(0, 5)}
  //       pagination={false}
  //       dataSource={[...statsreport]}
  //       scroll={{ y: 200 }}
  //       rowClassName={(item) =>
  //         item.claveMedico === "Total" ? "Resumen Total" : ""
  //       }
  //     />
  //     <div style={{ textAlign: "right" }}>
  //       <Tag color="lime"> {lenReport} Registros</Tag>
  //     </div>
  //   </div>
  // );
};

export default observer(CompMedicalStats);
