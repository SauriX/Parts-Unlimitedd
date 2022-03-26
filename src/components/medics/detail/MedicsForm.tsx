import { Spin, Form, Row, Col, Pagination, Button } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IMedicsForm, MedicsFormValues } from "../../../app/models/medics";

type MedicsFormProps = {
  id: number;
};

const MedicsForm: FC<MedicsFormProps> = ({ id }) => {
  const { medicsStore } = useStore();
  const { getById, create, update } = medicsStore;

  const [form] = Form.useForm<IMedicsForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState<IMedicsForm>(new MedicsFormValues());

  useEffect(() => {
    const readMedics = async (id: number) => {
      setLoading(true);
      const medics = await getById(id);
      form.setFieldsValue(medics!);
      setValues(medics!);
      setLoading(false);
    };

    if (id) {
      readMedics(id);
    }
  }, [form, getById, id]);

  const onFinish = (newValues: IMedicsForm) => {
    const medics = { ...values, ...newValues };
    if (medics.id) {
      create(medics);
    } else {
      update(medics);
    }
  };

  return (
    <Spin spinning={loading}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={12} sm={24} style={{ textAlign: "left" }}>
          <Pagination size="small" total={50} pageSize={1} current={9} />
        </Col>
        <Col md={12} sm={24} style={{ textAlign: "right" }}>
          <Button onClick={() => {}}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled}
            onClick={() => {
              form.submit();
            }}
          >
            Guardar
          </Button>
        </Col>
      </Row>
      <Form<IMedicsForm>
        {...formItemLayout}
        form={form}
        name="medics"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
        onFieldsChange={() => {
          setDisabled(
            !form.isFieldsTouched() || form.getFieldsError().filter(({ errors }) => errors.length).length > 0
          );
        }}
      >
        <Row>
          <Col md={12} sm={24}>
            <TextInput
              formProps={{
                name: "clave",
                label: "Clave",
              }}
              max={100}
              required
            />
          </Col>
          <Col md={12} sm={0}></Col>
          <Col md={12} sm={24}>
            <TextInput
              formProps={{
                name: "nombre",
                label: "Nombre",
              }}
              max={100}
              required
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={24}>
            <TextInput
              formProps={{
                name: "primerapellido",
                label: "PrimerApellido",
              }}
              max={100}
              required
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={24}>
            <TextInput
              formProps={{
                name: "segundoapellido",
                label: "SegundoApellido",
              }}
              max={100}
              required
            />
          <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "especialidad",
                label: "Especialidad",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "observaciones",
                label: "Observaciones",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "codigo P",
                label: "Codigo P",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "estado",
                label: "Estado",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "ciudad",
                label: "Ciudad",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "numero exterior",
                label: "Numero Exterior",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "numero interior",
                label: "Numero interior",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "calle",
                label: "Calle",
              }}
              <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "colonia",
                label: "Colonia",
              }}
              max={100}
            />
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "correo",
                label: "Correo",
              }}
              max={100}
            />
            <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "telefono",
                label: "Telefono",
              }}
              max={100}
            />
          </Col>
          <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "celular",
                label: "Celular",
              }}
              max={100}
            />
            </Col>
          
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default ReagentForm;
