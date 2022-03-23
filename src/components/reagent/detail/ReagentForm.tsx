import { Spin, Form, Row, Col, Pagination, Button } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";

type ReagentFormProps = {
  id: number;
};

const ReagentForm: FC<ReagentFormProps> = ({ id }) => {
  const { reagentStore } = useStore();
  const { getById, create, update } = reagentStore;

  const [form] = Form.useForm<IReagentForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState<IReagentForm>(new ReagentFormValues());

  useEffect(() => {
    const readReagent = async (id: number) => {
      setLoading(true);
      const reagent = await getById(id);
      form.setFieldsValue(reagent!);
      setValues(reagent!);
      setLoading(false);
    };

    if (id) {
      readReagent(id);
    }
  }, [form, getById, id]);

  const onFinish = (newValues: IReagentForm) => {
    const reagent = { ...values, ...newValues };
    if (reagent.id) {
      create(reagent);
    } else {
      update(reagent);
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
      <Form<IReagentForm>
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
                name: "claveSistema",
                label: "Clave Contpaq",
              }}
              max={100}
            />
          </Col>
          <Col md={12} sm={0}></Col>
          <Col md={12} sm={24}>
            <TextInput
              formProps={{
                name: "nombreSistema",
                label: "Nombre",
              }}
              max={100}
            />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default ReagentForm;
