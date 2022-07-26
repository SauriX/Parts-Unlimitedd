import { Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { IColumns } from "../../app/common/table/utils";
import { IReportData } from "../../app/models/report";

type ReportTableProps = {
  loading: boolean;
  data: IReportData[];
  columns: IColumns<IReportData>;
  hasFooterRow?: boolean;
};

const ReportTable = ({ loading, data, columns, hasFooterRow }: ReportTableProps) => {
  return (
    <Fragment>
      <Table<IReportData>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 500 }}
        rowClassName={(item) => (item.claveMedico == "Total" || item.paciente === "Total" ? "Resumen Total" : "")}
      />
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Tag color="lime">{!hasFooterRow ? data.length : Math.max(data.length - 1, 0)} Registros</Tag>
      </div>
    </Fragment>
  );
};

export default observer(ReportTable);
