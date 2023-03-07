import {
  Button,
  Col,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Space,
  Typography,
  Select,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import { formItemLayout } from "../../../app/util/utils";
import history from "../../../app/util/history";
import InvoiceCompanyDeliver from "../invoiceCompany/InvoiceCompanyCreate/InvoiceCompanyDeliver";

const { Title } = Typography;

type UrlParams = {
  id: string;
  tipo: string;
};
type InvoiceFreeDataProps = {
  createInvoice: () => void;
};
const InvoiceFreeData = () => {
  let { id, tipo } = useParams<UrlParams>();
  const [form] = Form.useForm();
  const {
    invoiceCompanyStore,
    modalStore,
    invoiceFreeStore,
    optionStore,
    profileStore,
  } = useStore();
  const { profile } = profileStore;
  const {
    printPdf,
    downloadPdf,
    downloadXML,
    setSerie,
    detailInvoice,
    configurationInvoice,
    checkIn,
    consecutiveBySerie,
    invoice,
  } = invoiceCompanyStore;
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
  const {
    receptor,
    tipoFacturaLibre,
    totalDetailInvoiceFree,
    setIsLoadingFree,
  } = invoiceFreeStore;
  const { openModal } = modalStore;

  useEffect(() => {
    getbankOptions();
    getpaymentMethodOptions();
    getcfdiOptions();
    getPaymentOptions();
    getInvoiceSeriesOptions(profile?.sucursal!);
  }, [profile]);
  useEffect(() => {
    form.setFieldsValue(receptor);
  }, [receptor]);
  useEffect(() => {
    if (id !== "new") {
      form.setFieldsValue(invoice);
      form.setFieldValue("numeroDeCuenta", invoice?.numeroCuenta);
      form.setFieldValue("formaDePagoId", invoice?.formaPago);
      form.setFieldValue("limiteDeCredito", invoice?.diasCredito);
      form.setFieldValue("serieCFDI", invoice?.serie);
      form.setFieldValue("metodoDePagoId", invoice?.tipoPago);
      form.setFieldValue("cfdiId", invoice?.usoCFDI);
    }
  }, [invoice]);

  const [tipoDescarga, setTipoDescarga] = useState<"pdf" | "xml">("pdf");
  const createInvoiceFree = async (newFormValues: any) => {
    setIsLoadingFree(true);
    const invoiceData: any = {};

    // if (tipoFacturaLibre) {
    invoiceData.tipoFactura = tipoFacturaLibre ? "company" : "request";
    invoiceData.origenFactura = "free";
    invoiceData.nombre = receptor.nombreComercial;
    invoiceData.companyId = receptor.id;
    invoiceData.taxDataId = null;
    invoiceData.expedienteId = null;
    invoiceData.solicitudesId = [];
    invoiceData.detalles = detailInvoice;
    invoiceData.serie = newFormValues.serieCFDI;
    invoiceData.bancoId = newFormValues.bancoId;
    invoiceData.diasCredito = receptor.diasCredito;
    invoiceData.formaPagoId = newFormValues.formaDePagoId;
    invoiceData.formaPago = paymentOptions.find(
      (x) => x.value === newFormValues.formaDePagoId
    )?.label;
    invoiceData.numeroCuenta = newFormValues.numeroDeCuenta;
    invoiceData.tipoPago = paymentMethodOptions.find(
      (x) => x.value === newFormValues.metodoDePagoId
    )?.label;
    invoiceData.tipo = invoiceData.tipoPago;
    invoiceData.claveExterna = receptor.clave;
    invoiceData.direccionFiscal = receptor.direccionFiscal;
    invoiceData.usoCFDI = cfdiOptions.find(
      (x) => x.value === receptor?.cfdiId
    )?.label;
    invoiceData.tipoDesgloce = configurationInvoice;
    //---
    invoiceData.cantidadTotal = totalDetailInvoiceFree;
    invoiceData.subtotal =
      totalDetailInvoiceFree - (totalDetailInvoiceFree * 16) / 100;
    invoiceData.IVA = (totalDetailInvoiceFree * 16) / 100;
    invoiceData.consecutivo = consecutiveBySerie;
    //---
    invoiceData.usuario = "";
    invoiceData.fecha = "";
    invoiceData.hora = "";
    invoiceData.cliente = {
      razonSocial: receptor?.razonSocial,
      direccionFiscal: receptor?.direccionFiscal,
      RFC: receptor?.rfc,
      regimenFiscal: receptor?.regimenFiscal,
      correo: receptor?.emailEmpresarial,
      codigoPostal: receptor?.codigoPostal,
      calle: receptor?.calle,
      numeroExterior: receptor?.numero,
      colonia: receptor?.colonia,
      ciudad: receptor?.ciudad,
      municipio: receptor?.ciudad,
      estado: receptor?.estado,
      pais: "MEX",
    };
    // }
    const invoiceInfo = await checkIn(invoiceData);
    if (!!invoiceInfo?.facturapiId) {
      alerts.success("Factura creada conrrectamente");
      history.push(`/invoice/${tipo}/${invoiceInfo?.facturapiId}`);
    }
    setIsLoadingFree(false);
  };
  const items = [
    {
      key: "1",
      label: "1st item",
    },
    {
      key: "2",
      label: "2nd item",
    },
    {
      key: "3",
      label: "3rd item",
    },
  ];

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="invoiceFreeData"
        onFinish={createInvoiceFree}
        size="small"
        initialValues={{ fechas: [moment(), moment()] }}
      >
        <Row>
          <Col span={24}>
            <Title level={5}>Datos de la factura</Title>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Row style={{ justifyContent: "start" }}>
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
                disabled={id !== "new"}
              >
                Registrar Factura
              </Button>
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
                  if (tipoDescarga === "pdf") {
                    downloadPdf(invoice?.facturaId);
                  }
                  if (tipoDescarga === "xml") {
                    downloadXML(invoice?.facturaId);
                  }
                }}
                disabled={id === "new"}
              >
                Descargar
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  printPdf(invoice?.facturaId!);
                }}
                disabled={id === "new"}
              >
                Imprimir
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  openModal({
                    title: "Configuración de envío",
                    body: (
                      <InvoiceCompanyDeliver
                        companiaId={invoice?.compañiaId}
                        facturapiId={invoice.facturapiId}
                        id={id!}
                        tipo={tipoFacturaLibre!}
                      />
                    ),
                    width: 800,
                  });
                }}
                disabled={id === "new"}
              >
                Configurar envió
              </Button>
            </Row>
          </Col>
        </Row>
        <Row justify="start">
          <Col span={8}>
            <SelectInput
              formProps={{ label: "Forma de pago", name: "formaDePagoId" }}
              options={paymentOptions}
              style={{ marginBottom: 10 }}
              readonly={id !== "new" || tipoFacturaLibre}
            />
            <TextInput
              formProps={{ label: "Numero de cuenta", name: "numeroDeCuenta" }}
              style={{ marginBottom: 10 }}
              readonly={id !== "new" || tipoFacturaLibre}
            />
            <SelectInput
              formProps={{ label: "Serie CFDI", name: "serieCFDI" }}
              options={invoiceSeriesOptions}
              required
              onChange={(serie: any) => {
                setSerie(serie);
              }}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ label: "Método de pago", name: "metodoDePagoId" }}
              options={paymentMethodOptions}
              style={{ marginBottom: 10 }}
              readonly={id !== "new" || tipoFacturaLibre}
            />
            <SelectInput
              formProps={{ label: "Banco", name: "bancoId" }}
              options={bankOptions}
              style={{ marginBottom: 10 }}
              readonly={id !== "new" || tipoFacturaLibre}
            />
            <SelectInput
              formProps={{ label: "uso CFDI", name: "cfdiId" }}
              readonly={id !== "new" || tipoFacturaLibre}
              options={cfdiOptions}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default observer(InvoiceFreeData);
