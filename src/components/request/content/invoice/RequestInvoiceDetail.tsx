import { Button, Checkbox, Col, Form, Row, Spin } from "antd";
import React, { useState } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { IFormError } from "../../../../app/models/shared";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const sendOptions = [
  { label: "Mandar via correo electronico", value: "correo" },
  { label: "Mandar via Whatsapp", value: "whatsapp" },
  { label: "Ambos", value: "ambos" },
];

const settingsOptions = [
  { label: "Desglozado", value: "desglozado" },
  { label: "Con Nombre", value: "nombre" },
];

const RequestInvoiceDetail = () => {
  const [form] = Form.useForm<any>();

  const [errors, setErrors] = useState<IFormError[]>([]);

  const onFinish = () => {};

  return (
    <Spin spinning={false}>
      <Form
        {...formItemLayout}
        form={form}
        name="invoice"
        onFinish={onFinish}
        onFinishFailed={({ errorFields }) => {
          const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
          setErrors(errors);
        }}
        scrollToFirstError
      >
        <Row gutter={[0, 12]}>
          <Col span={9}>
            <SelectInput
              formProps={{
                name: "formaPago",
                label: "Forma de pago",
              }}
              options={[]}
            />
          </Col>
          <Col span={10}>
            <TextInput
              formProps={{
                name: "numeroCuenta",
                label: "Número de cuenta",
                labelCol: { span: 10 },
                wrapperCol: { span: 14 },
              }}
            />
          </Col>
          <Col span={5}>
            <TextInput
              formProps={{
                name: "cantidad",
                label: "Cantidad",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              readonly
            />
          </Col>
          <Col span={9}>
            <SelectInput formProps={{ name: "serieCfdi", label: "Serie CFDI" }} options={[]} />
          </Col>
          <Col span={10}>
            <SelectInput
              formProps={{
                name: "usoCfdi",
                label: "Uso de CFDI",
                labelCol: { span: 10 },
                wrapperCol: { span: 14 },
              }}
              options={[]}
            />
          </Col>
          <Col span={24} style={{ textAlign: "start" }}>
            <Form.Item noStyle name="configuracion" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Checkbox.Group options={settingsOptions} />
            </Form.Item>
          </Col>
          <Col span={18} style={{ textAlign: "start" }}>
            <Form.Item noStyle name="metodoEnvio" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Checkbox.Group options={sendOptions} />
            </Form.Item>
          </Col>
          <Col span={6} style={{ textAlign: "end" }}>
            <Button type="primary">Registrar</Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default RequestInvoiceDetail;
