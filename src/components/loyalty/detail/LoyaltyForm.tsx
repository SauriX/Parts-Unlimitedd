import { Spin, Form, Row, Col, Pagination, Button, DatePicker, PageHeader, Divider } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { observer } from "mobx-react-lite";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { ILoyaltyForm, LoyaltyFormValues } from "../../../app/models/loyalty";
import views from "../../../app/util/view";
// import { v4 as uuid } from "uuid";

type LoyaltyFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const LoyaltyForm: FC<LoyaltyFormProps> = ({ id, componentRef, printing }) => {
  const { loyaltyStore} = useStore();
  const { getById, create, update, getAll, loyaltys } = loyaltyStore;
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ILoyaltyForm>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<ILoyaltyForm>(new LoyaltyFormValues());


  useEffect(() => {
    const readLoyalty = async (id: string) => {
      setLoading(true);
      const loyalty = await getById(id);
      form.setFieldsValue(loyalty!);
      setValues(loyalty!);
      setLoading(false);
    };

    if (id) {
      readLoyalty(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    if (loyaltys.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, loyaltys.length, searchParams]);

  const onFinish = async (newValues: ILoyaltyForm) => {
    setLoading(true);

    const loyalty = { ...values, ...newValues };

    let success = false;

    if (!loyalty.id) {
      success = await create(loyalty);
    } else {
      success = await update(loyalty);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.loyalty}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.loyalty}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return loyaltys.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const loyalty = loyaltys[page - 1];
    navigate(`/${views.loyalty}/${loyalty.id}?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={loyaltys?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={goBack}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton key="edit" title="Editar" image="editar" onClick={setEditMode} />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Lealtades" image="contactos" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ILoyaltyForm>
            {...formItemLayout}
            form={form}
            name="loyalty"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
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
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "tipoDescuento",
                    label: "Tipo de Descuento",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "cantidadDescuento",
                    label: "Descuento/Cantidad",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
                Descuento entre: 
                <RangePicker onChange={(value) => console.log(value![0])} />
              </Col>
              <SwitchInput
                  name="activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  label="Activo"
                  readonly={readonly}
                />
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(LoyaltyForm);