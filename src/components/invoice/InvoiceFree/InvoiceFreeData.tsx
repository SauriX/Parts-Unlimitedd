import { Button, Col, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useParams } from "react-router";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

const { Title } = Typography;

type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceFreeData = () => {
  let { id, tipo } = useParams<UrlParams>();
  const [form] = Form.useForm();
  const { invoiceCompanyStore, modalStore } = useStore();
  const { printPdf, downloadPdf } = invoiceCompanyStore;
  const { openModal } = modalStore;
  const onFinish = () => {};
  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="invoiceFreeData"
        onFinish={onFinish}
        size="small"
        initialValues={{ fechas: [moment(), moment()] }}
        onChange={(newFormValues: any) => {
          console.log("InvoiceFreeData");
          console.log("cambios invoice", newFormValues);
        }}
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
                  //   createInvoice(form.getFieldsValue());
                }}
                disabled={id !== "new"}
              >
                Registrar Factura
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  //   downloadPdf(invoiceExisting?.facturaId);
                }}
                disabled={id === "new"}
              >
                Descargar
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  //   printPdf(invoiceExisting?.facturaId);
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
                      //   <InvoiceCompanyDeliver
                      //     companiaId={company?.id}
                      //     facturapiId={facturapiId}
                      //     id={id!}
                      //     tipo={tipo!}
                      //   />
                      <div>a</div>
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
              formProps={{ label: "Forma de pago", name: "formaPago" }}
              options={[]}
              style={{ marginBottom: 10 }}
            />
            <SelectInput
              formProps={{ label: "Numero de cuenta", name: "numeroCuenta" }}
              options={[]}
              style={{ marginBottom: 10 }}
            />
            <SelectInput
              formProps={{ label: "Serie CFDI", name: "serieCFDI" }}
              options={[]}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ label: "Método de pago", name: "metodoPago" }}
              options={[]}
              style={{ marginBottom: 10 }}
            />
            <SelectInput
              formProps={{ label: "Banco", name: "banco" }}
              options={[]}
              style={{ marginBottom: 10 }}
            />
            <SelectInput
              formProps={{ label: "uso CFDI", name: "usoCFDI" }}
              options={[]}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default observer(InvoiceFreeData);
