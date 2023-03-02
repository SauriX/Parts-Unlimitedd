import { Button, Col, Descriptions, Form, Row, Select, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout, moneyFormatter } from "../../../../app/util/utils";
import InvoiceCompanyDeliver from "./InvoiceCompanyDeliver";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";

const { Title, Text } = Typography;

type UrlParams = {
  id: string;
  tipo: string;
};
type InvoiceCompanyInfoProps = {
  company: any;
  totalFinal: number;
  totalEstudios: number;
  createInvoice: any;

  invoice: string;
  facturapiId: string;
  estatusFactura: any;
};
const InvoiceCompanyData = ({
  company,
  totalEstudios,
  createInvoice,
  invoice,
  facturapiId,
  estatusFactura,
}: InvoiceCompanyInfoProps) => {
  let { id, tipo } = useParams<UrlParams>();
  const { optionStore, invoiceCompanyStore, modalStore, profileStore } =
    useStore();
  const { openModal } = modalStore;
  const {
    printPdf,
    downloadPdf,
    selectedRows,
    selectedRequests,
    invoice: invoiceExisting,
    setSerie,
  } = invoiceCompanyStore;
  const { profile } = profileStore;
  const {
    bankOptions,
    paymentOptions,
    paymentMethodOptions,
    cfdiOptions,
    getbankOptions,
    getpaymentMethodOptions,
    getcfdiOptions,
    getPaymentOptions,
    invoiceSeriesOptions,
    getInvoiceSeriesOptions,
  } = optionStore;
  const [form] = Form.useForm();
  const [tipoDescarga, setTipoDescarga] = useState<"pdf" | "xml">("pdf");
  useEffect(() => {
    getbankOptions();
    getpaymentMethodOptions();
    getcfdiOptions();
    getPaymentOptions();
    getInvoiceSeriesOptions(profile?.sucursal!);
  }, [profile]);
  useEffect(() => {
    console.log("factura lista", invoiceExisting);
    if (invoiceExisting) {
      if (tipo === "request") {
        form.setFieldValue("formaDePagoId", invoiceExisting.formaPago);
        form.setFieldValue("numeroDeCuenta", invoiceExisting.numeroCuenta);
        form.setFieldValue("cfdiId", invoiceExisting.usoCFDI);
        form.setFieldValue("serieCFDI", invoiceExisting.serie);
      }
    }
  }, [invoiceExisting]);
  const onFinish = () => {};
  useEffect(() => {
    if (tipo === "company") {
      console.log("COMPAÑIA datos de factura", toJS(company));
      form.setFieldsValue(company);
    }
  }, [company]);

  useEffect(() => {
    console.log("INVOICE EXISTING", toJS(invoiceExisting));
    form.setFieldsValue(invoiceExisting);
    if (tipo === "company") {
      form.setFieldValue("numeroDeCuenta", invoiceExisting?.numeroCuenta);
      form.setFieldValue("formaDePagoId", invoiceExisting?.formaPago);
      form.setFieldValue("limiteDeCredito", invoiceExisting?.diasCredito);
      form.setFieldValue("serieCFDI", invoiceExisting?.serie);
      form.setFieldValue("metodoDePagoId", invoiceExisting?.tipoPago);
      form.setFieldValue("cfdiId", invoiceExisting?.usoCFDI);
    }
  }, [invoiceExisting]);

  return (
    <>
      {/* <div className="status-container" style={{ marginBottom: 12 }}> */}
      <Form<any>
        {...formItemLayout}
        form={form}
        name="invoiceCompany"
        onFinish={onFinish}
        size="small"
        initialValues={{ fechas: [moment(), moment()] }}
      >
        <Row>
          <Col span={24}>
            <Title level={5}>Datos de la factura</Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Row style={{ justifyContent: "start" }}>
              {/* //BOTONES DE FACTURACION */}
              {/* <Col span={24}> */}
              {/* <Row style={{ justifyContent: "center" }}> */}
              <Button
                type="primary"
                onClick={() => {
                  createInvoice(form.getFieldsValue());
                }}
                disabled={id !== "new"}
              >
                Registrar Factura
              </Button>
              {/* </Row>
                <Row style={{ justifyContent: "center", paddingTop: 10 }}> */}
              <Select
                showArrow
                placeholder="Descarga"
                style={{ marginLeft: 10 }}
                options={[
                  {
                    label: "PDF",
                    value: "pdf",
                  },
                  {
                    label: "XML",
                    value: "xml",
                  },
                ]}
                allowClear
                defaultValue="pdf"
                disabled={id === "new"}
                onChange={(value: any) => {
                  setTipoDescarga(value);
                }}
              ></Select>
              <Button
                type="primary"
                onClick={() => {
                  downloadPdf(invoiceExisting?.facturaId);
                }}
                disabled={id === "new"}
              >
                Descargar
              </Button>
              {/* </Row> */}
              {/* <Row style={{ justifyContent: "center", paddingTop: 10 }}> */}
              <Button
                type="primary"
                onClick={() => {
                  printPdf(invoiceExisting?.facturaId);
                }}
                disabled={id === "new"}
              >
                Imprimir
              </Button>
              {/* </Row>
                <Row style={{ justifyContent: "center", paddingTop: 10 }}> */}
              <Button
                type="primary"
                onClick={() => {
                  openModal({
                    title: "Configuración de envío",
                    body: (
                      <InvoiceCompanyDeliver
                        companiaId={company?.id}
                        facturapiId={facturapiId}
                        id={id!}
                        tipo={tipo!}
                      />
                    ),
                    width: 800,
                  });
                }}
                disabled={id === "new"}
              >
                Configurar envió
              </Button>
              {/* </Row> */}
              {/* </Col> */}
            </Row>
          </Col>
        </Row>
        <Row style={{ paddingTop: 10 }}>
          <Col span={22}>
            <Row gutter={[0, 12]}>
              <Col span={10}>
                <SelectInput
                  formProps={{ name: "formaDePagoId", label: "Forma de pago" }}
                  options={
                    tipo === "company"
                      ? paymentOptions
                      : selectedRequests
                          .flatMap((x) => x.formasPagos)
                          .filter(
                            (value, index, arreglo) =>
                              arreglo.map((arr) => arr).indexOf(value) === index
                          )
                          .map((x) => ({
                            value: x,
                            label: x,
                          }))
                  }
                  readonly={id !== "new"}
                  required={tipo !== "company"}
                />
              </Col>
              <Col span={10} style={{ textAlign: "end" }}>
                <Text mark>{`Cantidad Total: ${
                  tipo === "request"
                    ? moneyFormatter.format(
                        id === "new"
                          ? totalEstudios
                          : invoiceExisting?.cantidadTotal
                      )
                    : id !== "new"
                    ? moneyFormatter.format(invoiceExisting?.cantidadTotal)
                    : moneyFormatter.format(totalEstudios)
                } (IVA incluido)`}</Text>
              </Col>
              <Col span={10}>
                {tipo === "company" && (
                  <TextInput
                    formProps={{
                      name: "numeroDeCuenta",
                      label: "Número de cuenta",
                    }}
                    readonly={id !== "new"}
                  />
                )}
                {tipo === "request" && (
                  <SelectInput
                    formProps={{
                      name: "numeroDeCuenta",
                      label: "Número de cuenta",
                    }}
                    options={selectedRequests
                      .flatMap((x) => x.numerosCuentas)
                      .filter(
                        (value, index, arreglo) =>
                          arreglo.map((arr) => arr).indexOf(value) === index
                      )
                      .map((x) => ({
                        value: x,
                        label: x,
                      }))}
                    readonly
                  />
                )}
              </Col>
              <Col span={10} style={{ textAlign: "end" }}>
                <div>
                  <Text style={{ textAlign: "center" }}>{`IVA 16%: ${
                    tipo === "request"
                      ? moneyFormatter.format(
                          id === "new"
                            ? (totalEstudios * 16) / 100
                            : invoiceExisting?.iva
                        )
                      : id !== "new"
                      ? moneyFormatter.format(invoiceExisting?.iva)
                      : moneyFormatter.format((totalEstudios * 16) / 100)
                  }`}</Text>
                </div>
              </Col>

              {tipo === "company" && (
                <Col span={10}>
                  <TextInput
                    formProps={{
                      name: "diasCredito",
                      label: "Días de crédito",
                    }}
                    readonly={id !== "new"}
                  />
                </Col>
              )}
              {tipo === "company" && (
                <Col span={10}>
                  <SelectInput
                    formProps={{
                      name: "metodoDePagoId",
                      label: "Método de pago",
                    }}
                    options={paymentMethodOptions}
                    readonly={id !== "new"}
                  />
                </Col>
              )}

              {tipo === "company" && (
                <Col span={10}>
                  <SelectInput
                    formProps={{ name: "bancoId", label: "Banco" }}
                    options={bankOptions}
                    readonly={id !== "new"}
                  />
                </Col>
              )}
              <Col span={10}>
                <SelectInput
                  formProps={{ name: "cfdiId", label: "Uso de CFDI" }}
                  options={cfdiOptions}
                  required={tipo !== "company"}
                  readonly={id !== "new"}
                />
              </Col>
              {tipo === "company" && (
                <Col span={10}>
                  <TextInput
                    formProps={{
                      name: "limiteDeCredito",
                      label: "Límite de crédito",
                    }}
                    readonly={id !== "new"}
                  />
                </Col>
              )}
              <Col span={10} style={{ textAlign: "end" }}>
                <div>
                  <Text style={{ textAlign: "center" }}>{`Subtotal: ${
                    tipo === "request"
                      ? moneyFormatter.format(
                          id === "new"
                            ? totalEstudios - (totalEstudios * 16) / 100
                            : invoiceExisting?.subtotal
                        )
                      : id !== "new"
                      ? moneyFormatter.format(invoiceExisting?.subtotal)
                      : moneyFormatter.format(
                          totalEstudios - (totalEstudios * 16) / 100
                        )
                  } `}</Text>
                </div>
              </Col>
              <Col span={10}>
                <SelectInput
                  formProps={{ name: "serieCFDI", label: "SerieCFDI" }}
                  options={invoiceSeriesOptions}
                  onChange={(serie: any) => {
                    setSerie(serie);
                  }}
                  readonly={id !== "new"}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      {/* </div> */}
    </>
  );
};

export default observer(InvoiceCompanyData);
