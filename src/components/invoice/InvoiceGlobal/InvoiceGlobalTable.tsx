import { Button, Col, Form, Row, Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { formItemLayout, moneyFormatter } from "../../../app/util/utils";
import InvoiceGlobalTableDetail from "./InvoiceGlobalTableDetail";

const InvoiceGlobalTable = () => {
  const { invoiceCompanyStore } = useStore();
  const { isLoading, invoices, setSelectedRequestGlobal, isLoadingGlobal } =
    invoiceCompanyStore;
  const [formCreate] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
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
    setSelectedRequestGlobal(selectedRowKeys);
  }, [selectedRowKeys]);
  useEffect(() => {
    setExpandedRowKeys(invoices.solicitudes?.map((x: any) => x.solicitudId));
    setOpenRows(true);
  }, [invoices]);
  const toggleRow = () => {
    if (openRows) {
      setOpenRows(false);
      setExpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setExpandedRowKeys(invoices.solicitudes?.map((x: any) => x.solicitudId));
    }
  };
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
      {invoices.solicitudes?.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Form<any>
            {...formItemLayout}
            form={formCreate}
            name="open"
            onFinish={() => {}}
            size="small"
          >
            <Row justify="end">
              <Col span={2}>
                <Button
                  type="primary"
                  onClick={toggleRow}
                  style={{ marginRight: 10 }}
                >
                  {!openRows ? "Abrir tabla" : "Cerrar tabla"}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
      <Table<any>
        bordered
        rowKey={(record) => record.solicitudId}
        columns={columns}
        pagination={false}
        loading={isLoading || isLoadingGlobal}
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
          getCheckboxProps: (record) => {
            return {
              disabled: record.facturas.some(
                (factura: any) => factura.estatus.nombre === "Facturado"
              ),
            };
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
                  indice={index}
                  facturas={data.facturas}
                  sucursal={data.nombreSucursal}
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
