import { Button, Col, Descriptions, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout, moneyFormatter } from "../../../../app/util/utils";
import InvoiceCompanyDeliver from "./InvoiceCompanyDeliver";
import { useParams } from "react-router-dom";

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
  const { printPdf, downloadPdf, selectedRows, selectedRequests } =
    invoiceCompanyStore;
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
  useEffect(() => {
    getbankOptions();
    getpaymentMethodOptions();
    getcfdiOptions();
    getPaymentOptions();
    getInvoiceSeriesOptions(profile?.sucursal!);
  }, [profile]);

  const onFinish = () => {};
  useEffect(() => {
    console.log("COMPANY", company);
    if (tipo === "company") {
      form.setFieldsValue(company);
    }
  }, [company]);
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
                  required={tipo !== "company"}
                />
              </Col>
              <Col span={10} style={{ textAlign: "end" }}>
                <Text mark>{`Cantidad Total: ${moneyFormatter.format(
                  totalEstudios
                )} (IVA incluido)`}</Text>
              </Col>
              <Col span={10}>
                {tipo === "company" && (
                  <TextInput
                    formProps={{
                      name: "numeroDeCuenta",
                      label: "Número de cuenta",
                    }}
                    // style={{ marginTop: 10 }}
                  />
                )}
                {tipo === "request" && (
                  <SelectInput
                    formProps={{
                      name: "numeroDeCuenta",
                      label: "Número de cuenta",
                    }}
                    // style={{ paddingTop: 10 }}
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
              <Col span={10}>
                <SelectInput
                  formProps={{ name: "serieCFDI", label: "SerieCFDI" }}
                  // style={{ paddingTop: 10 }}
                  options={invoiceSeriesOptions}
                />
              </Col>
              <Col span={10}>
                {tipo === "company" && (
                  <TextInput
                    formProps={{
                      name: "diasCredito",
                      label: "Días de crédito",
                    }}
                    // style={{ marginTop: 10 }}
                  />
                )}
              </Col>
              <Col span={10}>
                {tipo === "company" && (
                  <SelectInput
                    formProps={{
                      name: "metodoDePagoId",
                      label: "Método de pago",
                    }}
                    // style={{ marginTop: 10 }}
                    options={paymentMethodOptions}
                  />
                )}
              </Col>

              {tipo === "company" && (
                <Col span={10}>
                  <SelectInput
                    formProps={{ name: "bancoId", label: "Banco" }}
                    options={bankOptions}
                  />
                </Col>
              )}
              <Col span={10}>
                <SelectInput
                  formProps={{ name: "cfdiId", label: "Uso de CFDI" }}
                  // style={{ marginTop: 10 }}
                  options={cfdiOptions}
                  required={tipo !== "company"}
                />
              </Col>
              <Col span={10}>
                {tipo === "company" && (
                  <TextInput
                    formProps={{
                      name: "limiteDeCredito",
                      label: "Límite de crédito",
                    }}
                    // style={{ marginTop: 10 }}
                  />
                )}
              </Col>
              <Col span={10} style={{ textAlign: "end" }} offset={10}>
                <div>
                  <Text
                    style={{ textAlign: "center" }}
                  >{`IVA 16%: ${moneyFormatter.format(
                    (totalEstudios / 100) * 16
                  )}`}</Text>
                </div>
                <div>
                  <Text
                    style={{ textAlign: "center" }}
                  >{`Subtotal: ${moneyFormatter.format(
                    totalEstudios - (totalEstudios / 100) * 16
                  )} `}</Text>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Row style={{ justifyContent: "center" }}>
              {/* //BOTONES DE FACTURACION */}
              <Col span={24}>
                <Row style={{ justifyContent: "center" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      createInvoice(form.getFieldsValue());
                    }}
                    disabled={
                      invoice !== "new" && estatusFactura === "Facturado"
                    }
                  >
                    Registrar Factura
                  </Button>
                </Row>
                <Row style={{ justifyContent: "center", paddingTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log("FACTURAPI", facturapiId);
                      if (!!facturapiId) {
                        downloadPdf(facturapiId);
                      }
                    }}
                    disabled={
                      invoice === "new" || estatusFactura === "Cancelado"
                    }
                  >
                    Descargar
                  </Button>
                </Row>
                <Row style={{ justifyContent: "center", paddingTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (!!facturapiId) {
                        printPdf(facturapiId);
                      }
                    }}
                    disabled={
                      invoice === "new" || estatusFactura === "Cancelado"
                    }
                  >
                    Imprimir
                  </Button>
                </Row>
                <Row style={{ justifyContent: "center", paddingTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log("Compañia", company);
                      openModal({
                        title: "Configuración de envío",
                        body: (
                          <InvoiceCompanyDeliver
                            companiaId={company.id}
                            facturapiId={facturapiId}
                          />
                        ),
                        width: 800,
                      });
                    }}
                    disabled={
                      invoice === "new" || estatusFactura === "Cancelado"
                    }
                  >
                    Configurar envió
                  </Button>
                </Row>
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
