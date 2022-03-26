import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";

type ReagentFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const ReagentForm: FC<ReagentFormProps> = ({ id, componentRef, printing }) => {
  const { reagentStore } = useStore();
  const { getById, create, update } = reagentStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

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

  const onFinish = async (newValues: IReagentForm) => {
    const reagent = { ...values, ...newValues };

    let success = false;

    if (!reagent.id) {
      success = await create(reagent);
    } else {
      success = await update(reagent);
    }

    if (success) {
      navigate(`/reagent?search=${searchParams.get("search")}`);
    }
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
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
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Reactivos" image="reagent" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IReagentForm>
            {...formItemLayout}
            form={form}
            name="reagent"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
          >
            <Row>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "claveSistema",
                    label: "Clave Contpaq",
                  }}
                  max={100}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
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
        </div>
      </div>
    </Spin>
  );
};

export default ReagentForm;
