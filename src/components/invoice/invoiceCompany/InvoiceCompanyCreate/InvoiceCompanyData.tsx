import { Button, Col, Descriptions, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
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
  const [form] = Form.useForm();
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
              options={[]}
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
            <TextInput
              formProps={{ name: "metodoDePagoId", label: "Método de pago" }}
              style={{ marginTop: 10 }}
            />
          </Col>
          <Col span={10} style={{ paddingLeft: 10, textAlign: "end" }}>
            <Text
              style={{ textAlign: "center" }}
              mark
            >{`Cantidad Total: ${moneyFormatter.format(
              totalEstudios
            )} (IVA incluido)`}</Text>
            <TextInput formProps={{ name: "bancoId", label: "Banco" }} />
            <TextInput
              formProps={{ name: "cfdiId", label: "Uso de CFDI" }}
              style={{ marginTop: 10 }}
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
