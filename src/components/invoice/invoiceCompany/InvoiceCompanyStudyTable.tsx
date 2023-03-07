import { Checkbox, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";
type InvoiceCompanyStudyTableProps = {
  studies: any[];
  indice: number;
  areas: any[];
};
const InvoiceCompanyStudyTable = ({
  studies,
  indice,
  areas,
}: InvoiceCompanyStudyTableProps) => {
  const columns: IColumns = [
    {
      key: "estudio",
      dataIndex: "estudio",
      title: "Estudio",
      align: "center",
      width: 600,
    },
    {
      key: "area",
      dataIndex: "area",
      title: "Área",
      align: "center",
      render: (value) => {
        return <>{areas.find((x) => x.value === value)?.label}</>;
      },
    },
    {
      key: "precioFinal",
      dataIndex: "precioFinal",
      title: "Precio",
      align: "center",
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
  ];
  return (
    <>
      <Table<any>
        rowKey={(record) => record.solicitudEstudioId}
        size="small"
        className="header-expandable-table"
        bordered
        columns={columns}
        dataSource={studies}
        pagination={false}
        showHeader={indice === 0}
      />
    </>
  );
};

export default observer(InvoiceCompanyStudyTable);
