import { Table } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const columns: IColumns<any> = [
  {
    key: "id",
    dataIndex: "documento",
    title: "Documento",
    align: "left",
    width: "15%",
  },
  {
    key: "id",
    dataIndex: "cliente",
    title: "Cliente",
    align: "center",
    width: "15%",
  },
  {
    key: "id",
    dataIndex: "fechaCreacion",
    title: "Fecha Creación",
    align: "center",
    width: "15%",
  },
  {
    key: "id",
    dataIndex: "monto",
    title: "Monto",
    align: "center",
    width: "15%",
    render: (value) => `${moneyFormatter.format(value)} (IVA Incluido)`,
  },
];
const InvoiceFreeTable = () => {
  const { invoiceCompanyStore } = useStore();
  const { isLoading, invoicesFree } = invoiceCompanyStore;
  return (
    <>
      <Table
        bordered
        columns={columns}
        pagination={false}
        loading={isLoading}
        dataSource={invoicesFree}
      ></Table>
    </>
  );
};

export default observer(InvoiceFreeTable);
