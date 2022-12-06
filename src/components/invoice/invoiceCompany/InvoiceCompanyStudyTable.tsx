import { Checkbox, Table } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";

const InvoiceCompanyStudyTable = () => {
  const columns: IColumns = [
    {
      key: "estudio",
      dataIndex: "estudio",
      title: "Estudio",
      align: "center",
    },
    {
      key: "area",
      dataIndex: "area",
      title: "Área",
      align: "center",
    },
    {
      key: "precio",
      dataIndex: "precio",
      title: "Precio",
      align: "center",
    },
    {
      key: "estatus",
      dataIndex: "estatus",
      title: "Estatus",
      align: "center",
    },
    {
      key: "fechaEntrega",
      dataIndex: "fechaEntrega",
      title: "Fecha de entrega",
      align: "center",
    },
    {
      key: "d",
      dataIndex: "d",
      title: "D",
      align: "center",
    },
    {
      key: "c",
      dataIndex: "c",
      title: "C",
      align: "center",
    },
    {
      key: "Total",
      dataIndex: "total",
      title: "Total",
      align: "center",
    },
  ];
  return (
    <>
      <Table<any>
        size="small"
        className="header-expandable-table"
        bordered
        columns={columns}
      />
    </>
  );
};

export default observer(InvoiceCompanyStudyTable);
