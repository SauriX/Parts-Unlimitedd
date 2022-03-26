import { Spin, Form, Row, Col, Pagination, Button } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IIndicationForm, IndicationFormValues } from "../../../app/models/indication";

type IndicationFormProps = {
  id: number;
};

const IndicationForm: FC<IndicationFormProps> = ({ id }) => {
  const { indicationStore } = useStore();
  const { getById, create, update } = indicationStore;

  const [form] = Form.useForm<IIndicationForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState<IIndicationForm>(new IndicationFormValues());

  useEffect(() => {
    const readIndication = async (id: number) => {
      setLoading(true);
      const indication = await getById(id);
      form.setFieldsValue(indication!);
      setValues(indication!);
      setLoading(false);
    };

    if (id) {
      readIndication(id);
    }
  }, [form, getById, id]);

  const onFinish = (newValues: IIndicationForm) => {
    const indication = { ...values, ...newValues };
    if (indication.idIndicacion) {
      create(indication);
    } else {
      update(indication);
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
      <Form<IIndicationForm>
        {...formItemLayout}
        form={form}
        name="reagent"
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
          </Col>
          <Col md={12} sm={0}></Col>
          <Col md={12} sm={0}>
            <TextInput
              formProps={{
                name: "descripcion",
                label: "Descripcion",
              }}
              max={100}
            />
         
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default IndicationForm;
