import { Form, Row, Col, Checkbox, Input, Button } from "antd";
import { useState } from "react";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IFormError } from "../../../app/models/shared";

const RequestGeneral = () => {
  const [form] = Form.useForm();

  const [errors, setErrors] = useState<IFormError[]>([]);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={(values) => {
        console.log(values);
      }}
      onFinishFailed={({ errorFields }) => {
        const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
        setErrors(errors);
      }}
      size="small"
    >
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "procedencia",
              label: "Procedencia",
            }}
            options={[
              { label: "Compañía", value: 1 },
              { label: "Particular", value: 2 },
            ]}
          />
        </Col>
        <Col span={24}>
          <TextInput
            formProps={{
              name: "exp",
              label: "Compañia",
            }}
            max={100}
            errors={errors.find((x) => x.name === "exp")?.errors}
          />
        </Col>
        <Col span={24}>
          <TextInput
            formProps={{
              name: "sexo",
              label: "Médico",
            }}
            max={100}
            errors={errors.find((x) => x.name === "sexo")?.errors}
          />
        </Col>
        <Col span={24}>
          <TextInput
            formProps={{
              name: "fechaNacimiento",
              label: "Afiliación",
            }}
            max={100}
          />
        </Col>
        <Col span={24}>
          <TextInput
            formProps={{
              name: "edad",
              label: "Urgencia",
            }}
            max={100}
            errors={errors.find((x) => x.name === "edad")?.errors}
          />
        </Col>
        <Col span={24} style={{ textAlign: "end" }}>
          <Form.Item noStyle name="checkbox-group" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Checkbox.Group style={{ width: "100%" }}>
              <Row>
                <Col span={7} style={{ textAlign: "left" }}>
                  <Checkbox value="A" style={{ lineHeight: "32px" }}>
                    Mandar via correo electronico
                  </Checkbox>
                </Col>
                <Col span={6} style={{ textAlign: "left" }}>
                  <Checkbox value="B" style={{ lineHeight: "32px" }}>
                    Mandar via Whatsapp
                  </Checkbox>
                </Col>
                <Col span={11} style={{ textAlign: "left" }}>
                  <Checkbox value="C" style={{ lineHeight: "32px" }}>
                    Ambos
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="E-Mail"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className="no-error-text"
            help=""
          >
            <Input.Group>
              <TextInput
                formProps={{
                  name: "correo",
                  label: "E-Mail",
                  noStyle: true,
                }}
                width="50%"
                max={100}
                type="email"
                errors={errors.find((x) => x.name === "correo")?.errors}
              />
              <Button type="primary">Prueba</Button>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Whatsapp"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className="no-error-text"
            help=""
          >
            <Input.Group>
              <TextInput
                formProps={{
                  name: "whatsapp",
                  label: "Whatsapp",
                  noStyle: true,
                }}
                width="50%"
                max={100}
                errors={errors.find((x) => x.name === "correo")?.errors}
              />
              <Button type="primary">Prueba</Button>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <TextAreaInput
            formProps={{
              name: "observaciones",
              label: "Observaciones",
              labelCol: { span: 24 },
              wrapperCol: { span: 24 },
            }}
            rows={3}
            errors={errors.find((x) => x.name === "observaciones")?.errors}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default RequestGeneral;
