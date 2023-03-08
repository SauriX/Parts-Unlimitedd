import { Table } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

type InvoiceGlobalTableProps = {
  indice: number;
  facturas: any[];
};

const InvoiceGlobalTable = ({ indice }: InvoiceGlobalTableProps) => {
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave de factura",
      align: "left",
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Nombre",
      align: "center",
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "formaPago",
      title: "Forma de pago",
      align: "center",
      width: "15%",
    },

    {
      key: "id",
      dataIndex: "descuento",
      title: "Descuento",
      align: "center",
      width: "15%",
      render: (value) => `${moneyFormatter.format(value)} (IVA Incluido)`,
    },
    {
      key: "id",
      dataIndex: "cargo",
      title: "Cargo",
      align: "center",
      width: "15%",
      render: (value) => `${moneyFormatter.format(value)} (IVA Incluido)`,
    },
    {
      key: "id",
      dataIndex: "monto",
      title: "Monto",
      align: "center",
      width: "15%",
      render: (value) => `${moneyFormatter.format(value)} (IVA Incluido)`,
    },
    {
      key: "id",
      dataIndex: "sucrusal",
      title: "Sucursal",
      align: "center",
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "fecha",
      title: "Hora/Usuario",
      align: "center",
      width: "15%",
    },
  ];
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
        showHeader={indice === 0}
      ></Table>
    </>
  );
};

export default observer(InvoiceGlobalTable);
