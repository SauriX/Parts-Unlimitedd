import { Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";
import InvoiceGlobalTableDetail from "./InvoiceGlobalTableDetail";

const InvoiceGlobalTable = () => {
  const { invoiceCompanyStore } = useStore();
  const { isLoading, invoicesFree, invoices } = invoiceCompanyStore;
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>();
  const [openRows, setOpenRows] = useState<boolean>(false);
  const onExpand = (isExpanded: boolean, record: any) => {
    let expandRows: string[] = expandedRowKeys;
    if (isExpanded) {
      expandRows.push(record.solicitudId);
    } else {
      const index = expandRows.findIndex((x) => x === record.solicitudId);
      if (index > -1) {
        expandRows.splice(index, 1);
      }
    }
    setExpandedRowKeys(expandRows);
  };
  useEffect(() => {
    console.log("SELECTED ROWS KEYS", toJS(selectedRowKeys));
  }, [selectedRowKeys]);
  useEffect(() => {
    console.log("EXPANDED ROWS KEYS", toJS(expandedRowKeys));
  }, [expandedRowKeys]);
  useEffect(() => {
    setExpandedRowKeys(invoices.solicitudes?.map((x: any) => x.solicitudId));
    setOpenRows(true);
  }, [invoices]);
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Documento",
      align: "left",
      width: "100%",
      render: (value) => `Solicitud: ${value}`,
    },
  ];
  return (
    <>
      <Table<any>
        bordered
        rowKey={(record) => record.solicitudId}
        columns={columns}
        pagination={false}
        loading={isLoading}
        dataSource={invoices.solicitudes}
        showHeader={false}
        rowClassName={"row-search"}
        className="header-expandable-table"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        // scroll={{ y: 450 }}
        expandable={{
          onExpand: onExpand,
          expandedRowKeys: expandedRowKeys,
          rowExpandable: () => true,
          defaultExpandAllRows: true,
          expandedRowRender: (data, index) => {
            return (
              <>
                <InvoiceGlobalTableDetail
                  indice={0}
                  facturas={data.facturas ?? []}
                />
              </>
            );
          },
        }}
      ></Table>
    </>
  );
};

export default observer(InvoiceGlobalTable);
