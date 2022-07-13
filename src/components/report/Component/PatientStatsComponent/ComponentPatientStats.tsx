import { Divider, PageHeader, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import { IPatientStatisticList } from "../../../../app/models/patient_statistic";
import { useStore } from "../../../../app/stores/store";
import useWindowDimensions from "../../../../app/util/window";

const { Text } = Typography;

type CompPatientStatsProps = {
  printing: boolean;
};

const CompPatientStats: FC<CompPatientStatsProps> = ({printing,}) => {
  const { patientStatisticStore, optionStore } = useStore();
  const { getByName: getBranchByCount } = patientStatisticStore;
  const { getDeliveryOptions } = optionStore;
  const [loading, setLoading] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { statsreport } = patientStatisticStore;
  useEffect(() => {
    getDeliveryOptions();
  }, [getDeliveryOptions]);

  useEffect(() => {
    const readStatsReport = async () => {
      setLoading(true);
      await getBranchByCount();
      setLoading(false);
      getBranchByCount();
    };
    if (statsreport.length == 0) {
      readStatsReport();
    }
  }, []);

  const columns: IColumns<IPatientStatisticList> = [
    {
      ...getDefaultColumnProps("nombrePaciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: '50%',
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("solicitudes", "Solicitudes", {
        searchState,
        setSearchState,
        width: '20%',
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total Sol.", {
        searchState,
        setSearchState,
        width: '30%',
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const StatsReportTablePrint = () => (
    <div>
      <PageHeader
        ghost={false}
        title={<HeaderTitle title="Estadística de Pacientes" />}
        className="header-container"
      ></PageHeader>
      <Divider className="header-divider" />
      <Table<IPatientStatisticList>
        size="large"
        rowKey={(record) => record.id}
        columns={columns.slice(0, 3)}
        pagination={false}
        dataSource={[...statsreport]}
      />
      {/* <ReactECharts option={options} />; */}
    </div>
  );

  return (
    <div style={{ marginBottom: "20px" }}>
      <PageHeader
        ghost={false}
        title={<HeaderTitle title="Estadística de Pacientes" />}
        className="header-container"
      ></PageHeader>
      <Divider className="header-divider" />
      <Table<IPatientStatisticList>
        loading={loading}
        size="large"
        rowKey={(record) => record.id}
        columns={columns.slice(0, 3)}
        pagination={false}
        dataSource={[...statsreport]}
        // summary={pageData => {
        //   let totalBorrow = 10;
        //   let totalRepayment = 5;
        //   return (
        //     <>
        //       <Table.Summary.Row>
        //         <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
        //         <Table.Summary.Cell index={1}>
        //           <Text type="danger">{totalBorrow}</Text>
        //         </Table.Summary.Cell>
        //         <Table.Summary.Cell index={2}>
        //           <Text>{totalRepayment}</Text>
        //         </Table.Summary.Cell>
        //       </Table.Summary.Row>
        //     </>
        //   );
        // }}
      />
    </div>
  );
};

export default observer(CompPatientStats);
