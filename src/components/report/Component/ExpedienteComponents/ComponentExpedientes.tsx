import { Divider, PageHeader, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import { IReportList } from "../../../../app/models/report";
import { useStore } from "../../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";

type CompExpedienteProps = {
  // componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CompExpediente: FC<CompExpedienteProps> = ({
  // componentRef,
  printing,
}) => {
  const { reportStore, optionStore } = useStore();
  const { getBranchByCount } = reportStore;
  const { getDeliveryOptions } = optionStore;
  const [loading, setLoading] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { reports } = reportStore;
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
      ...getDefaultColumnProps("expedienteNombre", "Expediente", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("pacienteNombre", "Nombre", {
        searchState,
        setSearchState,
        width: "40%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("visitas", "Visitas", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const ReportTablePrint = () => (
    <div>
      <PageHeader
        ghost={false}
        title={ <HeaderTitle title="Estadística de expedientes" image="Reportes" /> }
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
  // "text-align:center"

  return (
      <div style={{ marginBottom: "20px" }}>
        <PageHeader
        ghost={false}
        title={ <HeaderTitle title="Estadística de expedientes" image="Reportes" /> }
        className="header-container"
      ></PageHeader>
        <Divider className="header-divider" />

        <Table<IReportList>
          loading={loading}
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 3)}
          pagination={false}
          dataSource={[...reports]}
          scroll={{ y: 200 }}
          rowClassName={(item) => item.expedienteNombre === "Total"? "Resumen Total": ""}
          />
          <div  style={{ textAlign: "right" }}>
         
      <Tag color="lime"> {reports.length} Registros</Tag>
          </div>
        </div>
  );
};
export default observer(CompExpediente);