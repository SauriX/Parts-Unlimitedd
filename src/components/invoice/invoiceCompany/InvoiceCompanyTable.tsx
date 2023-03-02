import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Radio,
  Row,
  Table,
  Typography,
} from "antd";
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
import alerts from "../../../app/util/alerts";
import { formItemLayout } from "../../../app/util/utils";
import moment from "moment";
const { Link, Text } = Typography;
type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceCompanyTable = () => {
  let { id, tipo } = useParams<UrlParams>();
  const navigate = useNavigate();
  const [formCreate] = Form.useForm();
  const isInvoice = Form.useWatch("isInvoice", formCreate);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>();
  const [selectedRequests, setSelectedRequests] = useState<any[]>();
  const [isSameCommpany, setIsSameCompany] = useState<boolean>(false);
  const { invoiceCompanyStore, optionStore } = useStore();
  const { areas, getareaOptions } = optionStore;
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  const {
    invoices,
    setSelectedRows,
    isLoading,
    selectedRows,
    printReceipt,
    isSameCommpany: mismaCompania,
  } = invoiceCompanyStore;
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
            {value
              .filter((factura: any) => factura.tipo === tipo)
              .map((factura: any) => {
                return (
                  <>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Link
                        onClick={() => {
                          console.log("row", toJS(value));
                          console.log("record", toJS(record));
                          navigate(`/invoice/${tipo}/${factura.facturapiId}`);
                        }}
                      >
                        {factura.serie}
                      </Link>
                      <span>
                        <small>
                          <Text type="secondary">
                            <Text
                              strong
                              type={
                                factura.estatus.nombre === "Cancelado"
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
    getareaOptions(0);
  }, []);
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
  const createInvoice = async (formValues: any) => {
    if (!selectedRows.length) {
      alerts.warning("No solicitudes seleccionadas");
      return;
    }
    if (!mismaCompania) {
      alerts.warning(
        "Las solicitudes seleccionadas no tienen la misma procedencia"
      );
      return;
    }

    let requestsWithInvoiceCompany: any[] = [];
    selectedRows.forEach((request) => {
      if (
        request.facturas.some(
          (invoice: any) =>
            invoice.tipo === tipo && invoice.estatus.nombre !== "Cancelado"
        )
      ) {
        requestsWithInvoiceCompany.push(request);
      }
    });

    if (!!requestsWithInvoiceCompany.length && isInvoice === "Factura") {
      // if (false) {
      alerts.confirmInfo(
        "Solicitudes facturadas",
        <>
          <Col>
            <div>
              Alguna de las solicitudes seleccionadas ya se encuentran
              procesadas en una factura:
            </div>
            {requestsWithInvoiceCompany.map((request) => {
              return (
                <div>
                  {request?.clave} -{" "}
                  {
                    request?.facturas.find(
                      (invoice: any) => invoice.tipo === tipo
                    )?.facturapiId
                  }
                </div>
              );
            })}
          </Col>
        </>,
        async () => {}
      );
    }

    if (!requestsWithInvoiceCompany.length || isInvoice === "Recibo") {
      // if (true) {
      if (formValues.isInvoice === "Factura") {
        if (tipo === "company") {
          navigate(`/invoice/company/new`);
        }
        if (tipo === "request") {
          navigate(`/invoice/request/new`);
        }
      } else {
        let solicitudesId = selectedRows.map((row) => row.solicitudId);
        let receiptCompanyData = {
          sucursal: "MONTERREY", // "SUCURSAL MONTERREY"
          folio: "",
          atiende: "",
          usuario: "",
          Contraseña: "",
          ContactoTelefono: "",
          SolicitudesId: solicitudesId,
        };
        printReceipt(receiptCompanyData);
      }
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
          <Form<any>
            {...formItemLayout}
            form={formCreate}
            name="invoiceCompanyCreate"
            onFinish={createInvoice}
            size="small"
            initialValues={{ fechas: [moment(), moment()] }}
            // onFieldsChange={() => {
            //   setDisabled(
            //     (!form.isFieldsTouched() ||
            //       form.getFieldsError().filter(({ errors }) => errors.length)
            //         .length > 0) &&
            //       isSameCommpany
            //   );
            // }}
          >
            <Row justify="end">
              {/* <Col span={8}>
                <Form.Item name="isInvoice" required>
                  <Row justify="center">
                    <Radio.Group>
                      <Radio value={"Factura"}>Factura</Radio>
                      <Radio value={"Recibo"}>Recibo</Radio>
                    </Radio.Group>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button
                  onClick={() => {
                    formCreate.submit();
                  }}
                  type="primary"
                  // disabled={disabled}
                >
                  Generar
                </Button>
              </Col> */}
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
                  areas={areas}
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
