import { Form, Row, Col, Input, Button, Spin } from "antd";
import DateInput from "../../app/common/form/proposal/DateInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { IProceedingForm } from "../../app/models/Proceeding";
import { useStore } from "../../app/stores/store";
import { useEffect, useState } from "react";
import moment from "moment";

const RequestRecord = () => {
  const { procedingStore, locationStore } = useStore();
  const { getById } = procedingStore;
  const { getColoniesByZipCode } = locationStore;

  const [form] = Form.useForm<IProceedingForm>();

  const [loading, setLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    const readRecord = async () => {
      setLoading(true);
      const record = await getById("850DA518-FFBB-4E8E-85CD-08DA5567441E");

      if (record) {
        if (record.fechaNacimiento) {
          record.fechaNacimiento = moment(record.fechaNacimiento);
        }

        if (record.cp) {
          const location = await getColoniesByZipCode(record.cp);
          const colony = location?.colonias?.find((x) => x.id === record.colonia)?.nombre;
          record.colonia = colony;
        }

        form.setFieldsValue({ ...record });
      }
      setLoading(false);
    };

    readRecord();
  }, [form, getById, getColoniesByZipCode]);

  return (
    <Spin spinning={loading}>
      <Form<IProceedingForm> {...formItemLayout} form={form} size="small">
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Form.Item
              label="Nombre"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              className="no-error-text"
              help=""
            >
              <Input.Group>
                <Row gutter={8}>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "nombre",
                        label: "Nombre(s)",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "apellido",
                        label: "Apellido(s)",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "correo",
                label: "E-Mail",
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
              }}
              max={500}
              type="email"
              readonly
            />
          </Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "expediente",
                label: "Exp",
              }}
              max={500}
              readonly
            />
          </Col>
          <Col span={4}>
            <SelectInput
              formProps={{
                name: "sexo",
                label: "Sexo",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              options={[
                { label: "F", value: "F" },
                { label: "M", value: "M" },
              ]}
              readonly
            />
          </Col>
          <Col span={8}>
            <DateInput
              formProps={{
                name: "fechaNacimiento",
                label: "Fecha Nacimiento",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              readonly
            />
          </Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "edad",
                label: "Edad",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              max={500}
              suffix={"años"}
              readonly
            />
          </Col>
          <Col span={8}>
            <Form.Item
              label="Contacto"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              help=""
              className="no-error-text"
            >
              <Input.Group>
                <Row gutter={8}>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "telefono",
                        label: "Teléfono",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "celular",
                        label: "Celular",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Dirección"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              help=""
              className="no-error-text"
            >
              <Input.Group>
                <Row gutter={8}>
                  <Col span={2}>
                    <TextInput
                      formProps={{
                        name: "cp",
                        label: "CP",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={4}>
                    <TextInput
                      formProps={{
                        name: "estado",
                        label: "Estado",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={5}>
                    <TextInput
                      formProps={{
                        name: "municipio",
                        label: "Municipio",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={6}>
                    <TextInput
                      formProps={{
                        name: "colonia",
                        label: "Colonia",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                  <Col span={7}>
                    <TextInput
                      formProps={{
                        name: "calle",
                        label: "Calle",
                        noStyle: true,
                      }}
                      max={500}
                      showLabel
                      readonly
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "end" }}>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default RequestRecord;
