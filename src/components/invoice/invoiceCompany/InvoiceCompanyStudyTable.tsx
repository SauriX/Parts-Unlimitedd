import { Checkbox, Table } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
type InvoiceCompanyStudyTableProps = {
  studies: any[];
  indice: number;
};
const InvoiceCompanyStudyTable = ({
  studies,
  indice,
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
