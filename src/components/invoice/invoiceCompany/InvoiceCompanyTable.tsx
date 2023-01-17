import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import InvoiceCompanyStudyTable from "./InvoiceCompanyStudyTable";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import { toJS } from "mobx";
import { moneyFormatter } from "../../../app/util/utils";
import { status } from "../../../app/util/catalogs";
const { Link, Text } = Typography;

const InvoiceCompanyTable = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>();
  const [selectedRequests, setSelectedRequests] = useState<any[]>();
  const [isSameCommpany, setIsSameCompany] = useState<boolean>(false);
  const { invoiceCompanyStore } = useStore();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  const { invoices, setSelectedRows, isLoading } = invoiceCompanyStore;
  const columns: IColumns = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
      render(value, record: any, index) {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link
              onClick={() => {
                navigate(`#`);
              }}
            >
              {record.clave}
            </Link>
            <small>
              <Text type="secondary">
                <Text strong>{record?.clavePatologica}</Text>
              </Text>
            </small>
          </div>
        );
      },
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        // searchState,
        // setSearchState,
        width: 300,
      }),
    },
    {
      ...getDefaultColumnProps("monto", "Monto", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
    {
      ...getDefaultColumnProps("cargo", "Cargo", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
    {
      ...getDefaultColumnProps("descuento", "Descuento", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
    {
      ...getDefaultColumnProps("facturas", "Facturas", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
      render(value, record: any, index) {
        return (
          <>
            {value.map((factura: any) => {
              return (
                <>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Link
                      onClick={() => {
                        console.log("row", toJS(value));
                        console.log("record", toJS(record));
                        navigate(`/invoice/create/${record.solicitudId}`);
                      }}
                    >
                      {factura.facturapiId}
                    </Link>
                    <span>
                      <small>
                        <Text type="secondary">
                          <Text
                            strong
                            type={
                              factura.estatus === "Cancelado"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {`(${factura.estatus?.clave})`}
                          </Text>
                        </Text>
                      </small>
                    </span>
                  </div>
                </>
              );
            })}
          </>
        );
      },
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
    },
    {
      ...getDefaultColumnProps("compania", "Compañia", {
        // searchState,
        // setSearchState,
        width: 10,
      }),
    },
  ];
  useEffect(() => {
    setExpandedRowKeys(invoices.solicitudes?.map((x: any) => x.solicitudId));
    setOpenRows(true);
  }, [invoices]);
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
  const toggleRow = () => {
    if (openRows) {
      setOpenRows(false);
      setExpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setExpandedRowKeys(invoices.solicitudes?.map((x: any) => x.solicitudId));
    }
  };
  return (
    <>
      {/* <Button
        onClick={() => {
          console.log("selectedRowKeys", selectedRequests);
        }}
      >
        AAA
      </Button> */}
      {invoices.solicitudes?.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Button
            type="primary"
            onClick={toggleRow}
            style={{ marginRight: 10 }}
          >
            {!openRows ? "Abrir tabla" : "Cerrar tabla"}
          </Button>
        </div>
      )}
      <Table<any>
        loading={isLoading}
        size="small"
        bordered
        rowKey={(record) => record.solicitudId}
        columns={[...columns]}
        pagination={false}
        dataSource={invoices.solicitudes ?? []}
        rowClassName={"row-search"}
        className="header-expandable-table"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRows([...selectedRows]);
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
                <InvoiceCompanyStudyTable
                  studies={data.estudios ?? []}
                  indice={index ?? 0}
                />
              </>
            );
          },
        }}
        footer={() => (
          <>
            {!!invoices.solicitudes?.length && (
              <Table
                size="small"
                bordered
                columns={[
                  {
                    key: "resumen",
                    dataIndex: "resumen",
                    title: "resumen",
                    align: "center",
                    render(value, record, index) {
                      return (
                        <>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Text>
                              Total de solicitudes {record.totalSolicitudes}
                            </Text>
                            <Text>
                              Total de estudios {record.totalEstudios}
                            </Text>
                          </div>
                        </>
                      );
                    },
                  },
                  {
                    key: "total",
                    dataIndex: "total",
                    title: "Compañia",
                    align: "center",
                    render() {
                      return "Gran Total";
                    },
                  },
                  {
                    key: "totalPrecio",
                    dataIndex: "totalPrecio",
                    title: "totalPrecio",
                    align: "center",
                    render(value, record, index) {
                      return moneyFormatter.format(value);
                    },
                  },
                  {
                    key: "totalD",
                    dataIndex: "totalD",
                    title: "totalD",
                    align: "center",
                    render(value, record, index) {
                      return moneyFormatter.format(value);
                    },
                  },
                  {
                    key: "totalC",
                    dataIndex: "totalC",
                    title: "totalC",
                    align: "center",
                    render(value, record, index) {
                      return moneyFormatter.format(value);
                    },
                  },
                  {
                    key: "total",
                    dataIndex: "total",
                    title: "total",
                    align: "center",
                    render(value, record, index) {
                      return moneyFormatter.format(value);
                    },
                  },
                ]}
                showHeader={false}
                pagination={false}
                dataSource={[invoices]}
              />
            )}
          </>
        )}
      />
    </>
  );
};
export default observer(InvoiceCompanyTable);
