import { Button, Col, Descriptions, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout, moneyFormatter } from "../../../../app/util/utils";

const { Title, Text } = Typography;
type InvoiceCompanyInfoProps = {
  company: any;
  totalFinal: number;
  totalEstudios: number;
  createInvoice: any;
};
const InvoiceCompanyData = ({
  company,
  totalEstudios,
  createInvoice,
}: InvoiceCompanyInfoProps) => {
  const { optionStore } = useStore();
  const {
    bankOptions,
    paymentOptions,
    paymentMethodOptions,
    cfdiOptions,
    getbankOptions,
    getpaymentMethodOptions,
    getcfdiOptions,
    getPaymentOptions,
  } = optionStore;
  const [form] = Form.useForm();
  useEffect(() => {
    getbankOptions();
    getpaymentMethodOptions();
    getcfdiOptions();
    getPaymentOptions();
  }, []);

  const onFinish = () => {};
  useEffect(() => {
    form.setFieldsValue(company);
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
          <Col span={10}>
            <SelectInput
              formProps={{ name: "formaDePagoId", label: "Forma de pago" }}
              options={paymentOptions}
            />
            <TextInput
              formProps={{ name: "numeroDeCuenta", label: "Número de cuenta" }}
              style={{ marginTop: 10 }}
            />
            <TextInput
              formProps={{ name: "serieCFDI", label: "SerieCFDI" }}
              style={{ marginTop: 10 }}
            />
            <TextInput
              formProps={{ name: "diasCredito", label: "Días de crédito" }}
              style={{ marginTop: 10 }}
            />
            <SelectInput
              formProps={{ name: "metodoDePagoId", label: "Método de pago" }}
              style={{ marginTop: 10 }}
              options={paymentMethodOptions}
            />
          </Col>
          <Col span={10} style={{ paddingLeft: 10, textAlign: "end" }}>
            <Text
              style={{ textAlign: "center" }}
              mark
            >{`Cantidad Total: ${moneyFormatter.format(
              totalEstudios
            )} (IVA incluido)`}</Text>
            <SelectInput
              formProps={{ name: "bancoId", label: "Banco" }}
              options={bankOptions}
            />
            <SelectInput
              formProps={{ name: "cfdiId", label: "Uso de CFDI" }}
              style={{ marginTop: 10 }}
              options={cfdiOptions}
            />
            <TextInput
              formProps={{
                name: "limiteDeCredito",
                label: "Límite de crédito",
              }}
              style={{ marginTop: 10 }}
            />
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
          <Col span={4} style={{ paddingLeft: 10, paddingTop: 10 }}>
            <Row style={{ justifyContent: "center" }}>
              <Button type="primary" onClick={createInvoice}>
                Registrar Factura
              </Button>
            </Row>
            <Row style={{ justifyContent: "center", paddingTop: 10 }}>
              <Button type="primary" onClick={() => {}}>
                Descargar
              </Button>
            </Row>
            <Row style={{ justifyContent: "center", paddingTop: 10 }}>
              <Button type="primary" onClick={() => {}}>
                Imprimir
              </Button>
            </Row>
            <Row style={{ justifyContent: "center", paddingTop: 10 }}>
              <Button type="primary" onClick={() => {}}>
                Configurar envió
              </Button>
            </Row>
          </Col>
        </Row>
        <Row justify="end">
          <Col span={4}></Col>
        </Row>
      </Form>
      {/* </div> */}
    </>
  );
};

export default observer(InvoiceCompanyData);
