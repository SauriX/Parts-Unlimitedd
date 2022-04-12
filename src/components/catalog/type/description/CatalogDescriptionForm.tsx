import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import TextAreaInput from "../../../../app/common/form/TextAreaInput";
import TextInput from "../../../../app/common/form/TextInput";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { CatalogDescriptionFormValues, ICatalogDescriptionForm } from "../../../../app/models/catalog";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";

type CatalogDescriptionFormProps = {
  id: number;
  catalogName: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogDescriptionForm: FC<CatalogDescriptionFormProps> = ({
  id,
  catalogName,
  componentRef,
  printing,
}) => {
  const { catalogStore } = useStore();
  const { getById, create, update } = catalogStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ICatalogDescriptionForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState<ICatalogDescriptionForm>(new CatalogDescriptionFormValues());

  useEffect(() => {
    const readCatalog = async (id: number) => {
      setLoading(true);
      const catalog = await getById<ICatalogDescriptionForm>(catalogName, id);
      form.setFieldsValue(catalog!);
      setValues(catalog!);
      setLoading(false);
    };

    if (id) {
      readCatalog(id);
    }
  }, [catalogName, form, getById, id]);

  const onFinish = async (newValues: ICatalogDescriptionForm) => {
    const catalog = { ...values, ...newValues };

    let success = false;

    if (!catalog.id) {
      success = await create(catalogName, catalog);
    } else {
      success = await update(catalogName, catalog);
    }

    if (success) {
      searchParams.delete("mode");
      setSearchParams(searchParams);
      navigate(`/catalogs?${searchParams}`);
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
          <Form<ICatalogDescriptionForm>
            {...formItemLayout}
            form={form}
            name="catalog"
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
                <TextAreaInput
                  formProps={{
                    name: "descripcion",
                    label: "Descripción",
                  }}
                  rows={3}
                  max={100}
                  required
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <SwitchInput name="activo" label="Activo" />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CatalogDescriptionForm);
