import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "../../../../app/common/button/IconButton";
import ImageButton from "../../../../app/common/button/ImageButton";
import NumberInput from "../../../../app/common/form/NumberInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import TextInput from "../../../../app/common/form/TextInput";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { CatalogDimensionFormValues, ICatalogDimensionForm } from "../../../../app/models/catalog";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";

const catalogName = "dimension";

type CatalogDimensionFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogDimensionForm: FC<CatalogDimensionFormProps> = ({ id, componentRef, printing }) => {
  const { catalogStore } = useStore();
  const { catalogs, getIndex, getById, create, update } = catalogStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ICatalogDimensionForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<ICatalogDimensionForm>(new CatalogDimensionFormValues());

  useEffect(() => {
    const readCatalog = async (id: number) => {
      setLoading(true);
      const catalog = await getById<ICatalogDimensionForm>(catalogName, id);
      form.setFieldsValue(catalog!);
      setValues(catalog!);
      setLoading(false);
    };

    if (id) {
      readCatalog(id);
    }
  }, [form, getById, id]);

  const onFinish = async (newValues: ICatalogDimensionForm) => {
    setLoading(true);
    const catalog = { ...values, ...newValues };

    let success = false;

    if (!catalog.id) {
      success = await create(catalogName, catalog);
    } else {
      success = await update(catalogName, catalog);
    }
    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/catalogs?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={12} sm={24} style={{ textAlign: "left" }}>
          {id > 0 && (
            <Pagination
              size="small"
              total={catalogs.length}
              pageSize={1}
              current={getIndex(id) + 1}
              onChange={(page) => {
                const catalog = catalogs[page - 1];
                navigate(`/catalogs/${catalog.id}?${searchParams}`);
              }}
            />
          )}
        </Col>
        <Col md={12} sm={24} style={{ textAlign: "right" }}>
          <Button onClick={goBack}>Cancelar</Button>
          {readonly ? (
            <ImageButton title="Editar" image="editar" onClick={() => setReadonly(false)} />
          ) : (
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
          )}
        </Col>
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo General" image="catalogo" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ICatalogDimensionForm>
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
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <NumberInput
                  formProps={{
                    name: "largo",
                    label: "Largo",
                  }}
                  max={256}
                  min={0}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <NumberInput
                  formProps={{
                    name: "ancho",
                    label: "Ancho",
                  }}
                  max={256}
                  min={0}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <SwitchInput name="activo" label="Activo" readonly={readonly} />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CatalogDimensionForm);
