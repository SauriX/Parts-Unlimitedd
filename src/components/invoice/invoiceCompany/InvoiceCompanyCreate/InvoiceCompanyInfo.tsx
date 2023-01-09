import { Button, Col, Divider, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
import DateRangeInput from "../../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { IOptions } from "../../../../app/models/shared";
import optionStore from "../../../../app/stores/optionStore";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";

const { Title, Text } = Typography;
type InvoiceCompanyInfoProps = {
  company: any;
};
const InvoiceCompanyInfo = ({ company }: InvoiceCompanyInfoProps) => {
  const [form] = Form.useForm();
  const onFinish = () => {};
  useEffect(() => {
    form.setFieldsValue(company);
  }, [company]);
  const reasonCancelation: IOptions[] = [
    {
      label: "01 Comprobantes emitidos con errores con relación.",
      value: "01 Comprobantes emitidos con errores con relación.",
    },
    {
      label: "02 Comprobantes emitidos con errores sin relación",
      value: "02 Comprobantes emitidos con errores sin relación",
    },
    {
      label: "03 No se llevó a cabo la operación.",
      value: "03 No se llevó a cabo la operación.",
    },
    {
      label: "04 Operación nominativa relacionada en una factura global.",
      value: "04 Operación nominativa relacionada en una factura global.",
    },
  ];
  return (
    <>
      <Row justify="end" gutter={[24, 12]} className="filter-buttons">
        <Col span={24}>
          <Button type="primary">Cancelar</Button>
        </Col>
      </Row>
      <div className="status-container" style={{ marginBottom: 12 }}>
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
              <Row justify="space-between" gutter={[12, 12]}>
                <Col span={12}>
                  <Title level={5}>Datos de la compañia</Title>
                </Col>
                <Col span={12}>
                  <SelectInput
                    multiple
                    formProps={{ label: "Selecciona motivo", name: "motivo" }}
                    options={reasonCancelation}
                  />
                </Col>

                <Col span={6}>
                  <TextInput
                    formProps={{ name: "clave", label: "Clave" }}
                    style={{ marginBottom: 10 }}
                  />
                  <TextInput formProps={{ name: "nombre", label: "Nombre" }} />
                </Col>
                <Col span={6}>
                  <TextInput
                    formProps={{ name: "rfc", label: "RFC" }}
                    style={{ marginBottom: 10 }}
                  />
                  <TextAreaInput
                    formProps={{
                      name: "direccionFiscal",
                      label: "Dirección fiscal",
                    }}
                    rows={3}
                  />
                  <TextInput
                    formProps={{ name: "razonSocial", label: "Razón social" }}
                    style={{ marginTop: 10 }}
                  />
                </Col>
                <Col span={12}>
                  <DateRangeInput
                    formProps={{
                      label: "Periodo de búsqueda de solicitudes:",
                      name: "fechas",
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default observer(InvoiceCompanyInfo);
