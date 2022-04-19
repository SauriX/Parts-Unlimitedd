import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Select,
} from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ICompanyForm, CompanyFormValues } from "../../../app/models/company";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { IContactList } from "../../../app/models/contact";
import { observer } from "mobx-react-lite";
import { List, Typography } from "antd";
import { IOptions } from "../../../app/models/shared";
import TextArea from "antd/lib/input/TextArea";
import Company from "../../../views/Company";
import { createSecureContext } from "tls";
import Item from "antd/lib/list/Item";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { claveValues } from "../../../app/models/user";
import MaskInput from "../../../app/common/form/MaskInput";

type CompanyFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const CompanyForm: FC<CompanyFormProps> = ({ id, componentRef, printing }) => {
  const { companyStore, optionStore, locationStore } = useStore();
  const { getById, create, update, getAll, company } = companyStore;
  const { paymentOptions, getpaymentOptions,
          bankOptions, getbankOptions,
          cfdiOptions, getcfdiOptions,
          paymentMethodOptions, getpaymentMethodOptions
  } = optionStore;
  const { getColoniesByZipCode } = locationStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<ICompanyForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<ICompanyForm>(new CompanyFormValues());

  // const clearLocation = useCallback(() => {
  //   form.setFieldsValue({
  //     estado: undefined,
  //     ciudad: undefined,
  //     coloniaId: undefined,
  //   });
  //   setColonies([]);
  // }, [form]);

  // const getLocation = useCallback(
  //   async (zipCode: string) => {
  //     const location = await getColoniesByZipCode(zipCode);
  //     if (location) {
  //       form.setFieldsValue({
  //         estado: location.estado,
  //         ciudad: location.ciudad,
  //       });
  //       setColonies(
  //         location.colonias.map((x) => ({
  //           value: x.id,
  //           label: x.nombre,
  //         }))
  //       );
  //     } else {
  //       clearLocation();
  //     }
  //   },
  //   [clearLocation, form, getColoniesByZipCode]
  // );

  // useEffect(() => {
  //   const readCompany = async (id: number) => {
  //     setLoading(true);
  //     const company = await getById(id);

  //     if (company) {
  //       form.setFieldsValue(company);
  //       getLocation(company.CodigoPostal.toString());
  //       setValues(company);
  //     }

  //     setLoading(false);
  //     console.log(company);
  //   };

  //   if (id) {
  //     readCompany(id);
  //   }
  // }, [form, getById, getLocation, id]);

  
  useEffect(() => {
    getpaymentOptions(); getbankOptions(); 
    getcfdiOptions(); getpaymentMethodOptions();
  }, [getpaymentOptions,
     getbankOptions,
     getcfdiOptions,
     getpaymentMethodOptions]);

  useEffect(() => {
    const readCompany = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readCompany();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: ICompanyForm) => {
    const company = { ...values, ...newValues };

    let success = false;

    const contacts = [...company.contact];
    contacts.forEach((v, i, a) => {
      a[i].id = typeof a[i].id === "string" ? 0 : v.id;
    });
    company.contact = contacts;

    if (!company.id) {
      success = await create(company);
    } else {
      success = await update(company);
    }

    if (success) {
      navigate(`/company?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualcompany = () => {
    if (id) {
      const index = company.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextCompany = (index: number) => {
    const companys = company[index];
    navigate(
      `/company/${companys?.id}?mode=${searchParams.get(
        "mode"
      )}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    console.log(values);
  }, [values]);

  const onValuesChange = async (changeValues: any, values: ICompanyForm) => {
    console.log(changeValues, values);

    //   const code =
    //     values.nombre.substring(0, 3) +
    //     values.primerApellido?.substring(0, 1) +
    //     values.segundoApellido?.substring(0, 1);

    //   form.setFieldsValue({ clave: code.toUpperCase() });

    //   const field = Object.keys(changeValues)[0];

    //   if (field === "codigoPostal") {
    //     const zipCode = changeValues[field] as string;

    //     if (zipCode && zipCode.toString().trim().length === 5) {
    //       getLocation(zipCode);
    //     } else {
    //       clearLocation();
    //     }
    //   }
  };
 

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={10} sm={24} style={{ marginRight: 20 }}>
          <Pagination
            size="small"
            total={company.length}
            pageSize={1}
            current={actualcompany()}
            onChange={(value) => {
              prevnextCompany(value - 1);
            }}
          />
          <Form<ICompanyForm>
            {...formItemLayout}
            form={form}
            name="company"
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
              );
            }}
          ></Form>
        </Col>
        <Col md={8} sm={24} style={{ marginRight: 20, textAlign: "right" }}>
          {readonly && (
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                setReadonly(false);
              }}
            />
          )}
        </Col>
        <Col md={2} sm={24} style={{ marginRight: 20, textAlign: "right" }}>
          <Button
            onClick={() => {
              navigate("/company");
            }}
          >
            Cancelar
          </Button>
        </Col>
        <Col md={2} sm={24} style={{ marginRight: 10, textAlign: "right" }}>
          {!readonly && (
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={() => {
                form.submit();
                return;
              }}
            >
              Guardar
            </Button>
          )}
        </Col>
      </Row>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle title="Catálogo de Compañias" image="doctor" />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ICompanyForm>
            {...formItemLayout}
            form={form}
            name="company"
            onValuesChange={onValuesChange}
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
              );
            }}
          >
            <Row>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                  type="string"
                />
                <TextInput
                  formProps={{
                    name: "contrasena",
                    label: "Contraseña. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                 <TextInput
                  formProps={{
                    name: "emailEmpresarial",
                    label: "E-mail empresarial. ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "nombreComercial",
                    label: "Nombre comercial. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "Procedencia",
                    label: "Procedencia. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "ListaPrecioId",
                    label: "Lista de precio: ",
                  }}
                  max={100000}
                  min={10000}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "PromocionesId",
                    label: "Lista de promoción: ",
                  }}
                  max={100000}
                  min={10000}
                  readonly={readonly}
                />
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
                </Col>
                <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "RFC",
                    label: "RFC. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />

                <NumberInput
                  formProps={{
                    name: "CodigoPostal",
                    label: "Código P: ",
                  }}
                  max={9999999999}
                  min={1000}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "EstadoId",
                    label: "Estado. ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                
                <TextInput
                  formProps={{
                    name: "MunicipioId",
                    label: "Municipio. ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "RazonSocial",
                    label: "Razón social: ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <SelectInput //Crear y cambier field option, store a Metodo de pago
                  formProps={{
                    name: "MetodoDePagoId",
                    label: "Método de pago: ",
                  }}
                  readonly={readonly}
                  required
                  options={paymentMethodOptions}
                />
                <SelectInput //Crear y cambier field option, store a Forma de pago
                  formProps={{
                    name: "FormaDePagoId",
                    label: "Forma de pago: ",
                  }}
                  readonly={readonly}
                  options={paymentOptions}
                />
                <TextInput
                  formProps={{
                    name: "LimiteDeCredito",
                    label: "Limite de crédito: ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "DiasCredito",
                    label: "Dias de crédito: ",
                  }}
                  max={99}
                  min={1}
                  readonly={readonly} 
                />
                <SelectInput //Crear y cambier field option, store a CFDI
                  formProps={{
                    name: "CFDIId",
                    label: "CFDI: ",
                  }}
                  readonly={readonly}
                  options={cfdiOptions}
                />
                <TextInput
                  formProps={{
                    name: "NumeroDeCuenta",
                    label: "Número de cuenta: ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <SelectInput //Crear y cambier field option, store a Banco
                  formProps={{
                    name: "BancoId",
                    label: "Banco: ",
                  }}
                  readonly={readonly}
                  options={bankOptions}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div></div>
    </Spin>
  );
};

export default observer(CompanyForm);
