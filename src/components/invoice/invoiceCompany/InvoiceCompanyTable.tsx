import { Checkbox, Table } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import InvoiceCompanyStudyTable from "./InvoiceCompanyStudyTable";

const InvoiceCompanyTable = () => {
  const columns: IColumns = [
    {
      key: "id",
      dataIndex: "id",
      title: "Id",
      align: "center",
    },
    {
      key: "nombre",
      dataIndex: "nombre",
      title: "Nombre",
      align: "center",
    },

    {
      key: "cargo",
      dataIndex: "cargo",
      title: "Cargo",
      align: "center",
    },
    {
      key: "descuento",
      dataIndex: "descuento",
      title: "Descuento",
      align: "center",
    },

    {
      key: "monto",
      dataIndex: "monto",
      title: "Monto",
      align: "center",
    },
    {
      key: "factura",
      dataIndex: "factura",
      title: "Factura",
      align: "center",
    },
    {
      key: "sucursal",
      dataIndex: "sucursal",
      title: "RFC",
      align: "center",
    },
    {
      key: "compañia",
      dataIndex: "compañia",
      title: "Compañia",
      align: "center",
    },
    {
      key: "seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: 1,
      render: () => <Checkbox />,
    },
  ];
  return (
    <>
      <Table<any>
        size="small"
        bordered
        rowClassName="row-search"
        columns={columns}
        expandable={{
          onExpand: () => {},
          expandedRowKeys: [],
          expandedRowRender: (data, index) => {
            return (
              <>
                <InvoiceCompanyStudyTable />
              </>
            );
          },
        }}
      ></Table>
    </>
  );
};
export default observer(InvoiceCompanyTable);
