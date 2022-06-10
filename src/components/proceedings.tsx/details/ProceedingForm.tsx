import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import NumberInput from "../../../app/common/form/NumberInput";
import SelectInput from "../../../app/common/form/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
type ProceedingFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const ProceedingForm: FC<ProceedingFormProps> = ({ id, componentRef, printing }) => {
  const navigate = useNavigate();
  const { modalStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [form] = Form.useForm();
  const [values, setValues] = useState();
  const { openModal } = modalStore;
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.promo}?${searchParams}`);
  };
  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idListaPrecios") { }
  };
  const setEditMode = () => {
    navigate(`/${views.promo}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const onFinish = async (newValues: any) => {
    setLoading(true);

    //const reagent = { ...values, ...newValues }; 
    /*         console.log(reagent,"en el onfish")
            console.log(reagent); */
    let success = false;

    /*         if (!reagent.id) {
              success = await create(reagent);
            } else {
              success = await update(reagent);
            } */

    setLoading(false);

    if (success) {
      goBack();
    }
  };
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
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
              title={<HeaderTitle title="Catálogo de Promociones en listas de precios" image="promo" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<any>
            {...formItemLayout}
            form={form}
            name="proceeding"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre(s)",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Exp",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "apellido",
                    label: "Apellido (s)",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "sexo",
                    label: "Sexo",
                  }}
                  options={[{ value: "M", label: "M" }, { value: "F", label: "F" }]}></SelectInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <label style={{ marginLeft: "30px" }} htmlFor="">Fecha Nacimiento: </label>
                <DatePicker style={{ marginLeft: "10px" }} />
              </Col>
              <Col md={6} sm={24} xs={12}>
                <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                  }}
                  min={0}
                ></NumberInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "telefono",
                    label: "Teléfono",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "E-Mail",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "cp",
                    label: "CP",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  options={[]}></SelectInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "municipio",
                    label: "Municipio",
                  }}
                  options={[]}></SelectInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle y Número",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "colonia",
                    label: "Colonia",
                  }}
                  max={100}
                ></TextInput>
              </Col>
              <Col md={24} style={{ textAlign: "center" }}>
                <Button onClick={() => openModal({ title: "tets", body: <Test />, closable: true })} style={{ backgroundColor: "#6EAA46", color: "white", borderColor: "#6EAA46" }}>Datos Fiscales</Button>
              </Col>
            </Row>
          </Form>
          
        </div>
      </div>
    </Spin>
  );
}

const Test = () => {
  return <div>Prueba</div>
}
export default observer(ProceedingForm);