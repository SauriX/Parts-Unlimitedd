import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Table, FormInstance } from "antd";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useStore } from "../../../app/stores/store";
import { Search, useNavigate, useSearchParams } from "react-router-dom";
import { ICompanyForm, CompanyFormValues } from "../../../app/models/company";
import { IContactForm, ContactFormValues } from "../../../app/models/contact";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { IContactList } from "../../../app/models/contact";
import { observer } from "mobx-react-lite";
import { List, Typography } from "antd";
import { IOptions } from "../../../app/models/shared";
import Company from "../../../views/Company";
import Item from "antd/lib/list/Item";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/MaskInput";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import IconButton from "../../../app/common/button/IconButton";
import CompanyFormTableHeader from "./CompanyFormTableHeader";
import { useReactToPrint } from "react-to-print";
import { EditOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

type CompanyFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const CompanyForm: FC<CompanyFormProps> = ({ id, componentRef, printing }) => {
  const { companyStore, optionStore, locationStore } = useStore();
  const { getById, generatePass, create, update, getAll, company } = companyStore;
  const {
    provenanceOptions,
    getprovenanceOptions,
    paymentOptions,
    getpaymentOptions,
    // priceOptions,
    // getpriceOptions,
    bankOptions,
    getbankOptions,
    cfdiOptions,
    getcfdiOptions,
    paymentMethodOptions,
    getpaymentMethodOptions,
  } = optionStore;
  const { getColoniesByZipCode } = locationStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ICompanyForm>();
  const [formContact] = Form.useForm<IContactForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<ICompanyForm>(new CompanyFormValues());
  // const [valuesContact, setValuesContact] = useState<IContactForm>(
  //   new ContactFormValues()
  // );
  const [contacts, setContacts] = useState<IContactForm[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContactForm[]>([]);
  const [editContact, setEditContact] = useState<IContactForm>();

  const clearLocation = useCallback(() => {
    form.setFieldsValue({
      estado: undefined,
      ciudad: undefined,
    });
    setColonies([]);
  }, [form]);

  const getLocation = useCallback(
    async (zipCode: string) => {
      const location = await getColoniesByZipCode(zipCode);
      if (location) {
        form.setFieldsValue({
          estado: location.estado,
          ciudad: location.ciudad,
        });
        setColonies(
          location.colonias.map((x) => ({
            value: x.id,
            label: x.nombre,
          }))
        );
      } else {
        clearLocation();
      }
    },
    [clearLocation, form, getColoniesByZipCode]
  );

  useEffect(() => {
    const readCompany = async (id: string) => {
      setLoading(true);
      const company = await getById(id);
      console.log(company);
      if (company) {
        form.setFieldsValue(company);
        setValues(company);
        setContacts(company.contacts);
        setFilteredContacts(company.contacts);
        getLocation(company.codigoPostal?.toString());
      }

      setLoading(false);
      console.log(company);
    };

    if (id) {
      readCompany(id);
    }
  }, [form, getById, getLocation, id]);

  useEffect(() => {
    getpaymentOptions();
    getbankOptions();
    getcfdiOptions();
    getpaymentMethodOptions();
    // getpriceOptions();
    getprovenanceOptions();
  }, [
    getpaymentOptions,
    getbankOptions,
    getcfdiOptions,
    getpaymentMethodOptions,
    // getpriceOptions,
    getprovenanceOptions,
  ]);
  console.log(values.contacts);

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
    company.contacts = contacts;

    let success = false;

    // const contacts = [...company.contacts];
    // contacts.forEach((v, i, a) => {
    //   a[i].idContacto = typeof a[i].idContacto === "string" ? 0 : v.idContacto;
    // });
    // company.contacts = contacts;

    if (!company.id) {
      company.id= "00000000-0000-0000-0000-000000000000"
      success = await create(company);
    } else {
      success = await update(company);
    }

    if (success) {
      navigate(`/companies?search=${searchParams.get("search") || "all"}`);
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
      `/companies/${companys?.id}?mode=${searchParams.get("mode")}&search=${searchParams.get("search")}`
    );
  };
  console.log("Aqui esta el console");
  console.log(id);
  useEffect(() => {
    const newpass = async () => {
      let pass = await generatePass();
      form.setFieldsValue({ contrasena: pass });
    };
    console.log(values);
    if (!id ) {
      console.log(id);
      console.log(id);
      newpass();
    }
  }, [values]);

  const onValuesChange = async (changeValues: any, values: ICompanyForm) => {
    console.log(changeValues, values);

    const field = Object.keys(changeValues)[0];

    if (field === "codigoPostal") {
      const zipCode = changeValues[field] as string;

      if (zipCode && zipCode.toString().trim().length === 5) {
        getLocation(zipCode);
      } else {
        clearLocation();
      }
    }
  };

  const botonEdit = () => {
    setReadonly(false);
    navigate(`/companies/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`);
  };

  //   const { Search } = Input;

  const [, setPrinting] = useState(false);
  const handleCompanyPrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });
  console.log(values);
  console.log("Table");
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IContactForm> = [
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",

      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, contact) => (
        <IconButton
          title="Editar Contacto"
          icon={<EditOutlined />}
          onClick={() => {
            formContact.setFieldsValue(contact);
            setEditContact(contact);
          }}
        />
      ),
    },
  ];

  const onFinishContact = (contact: IContactForm) => {
    contact.telefono = contact.telefono
      ? parseInt(contact.telefono.toString()?.replaceAll("_", "0")?.replaceAll("-", ""))
      : undefined;

    if (!editContact) {
      contact.id = 0;
      contact.tempId = uuid();
      setContacts((prev) => [...prev, contact]);
    } else {
      const index = contacts.findIndex((x) => x.id === editContact.id && x.tempId === editContact.tempId);
      if (index > -1) {
        const all = [...contacts];
        all[index] = { ...editContact, ...contact };
        setContacts(all);
      }
    }

    formContact.resetFields();
    setEditContact(undefined);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id  && (
          <Col md={12} sm={24} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={company.length}
              pageSize={1}
              current={actualcompany()}
              onChange={(value) => {
                prevnextCompany(value - 1);
              }}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("/companies");}}
            >
              {" "}
              Cancelar{" "}
            </Button>
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
          </Col>
        )}

        {readonly && (
          <Col md={12} sm={24} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              //onClick={() => {  setReadonly(false); }}
              //onClick={() =>  { navigate(`/companies/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`) ; }}
              onClick={() => {
                botonEdit();
              }}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col md={10} sm={24} style={{ marginRight: 20 }}>
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
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
          ></Form>
        </Col>
      </Row>

      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Compañias" image="Company" />}
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
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
          >
            <Row>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                  type="string"
                />
                <TextInput
                  formProps={{
                    name: "contrasena",
                    label: "Contraseña ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "emailEmpresarial",
                    label: "E-mail empresarial ",
                  }}
                  max={100}
                  readonly={readonly}
                  type="email"
                />
                <TextInput
                  formProps={{
                    name: "nombreComercial",
                    label: "Nombre comercial ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                
                <SelectInput
                  formProps={{
                    name: "procedenciaId",
                    label: "Procedencia ",
                  }}
                  readonly={readonly}
                  required
                  options={provenanceOptions}
                />
                <NumberInput
                  formProps={{
                    name: "listaPrecioId",
                    label: "Lista de precio: ",
                  }}
                  max={100000}
                  min={10}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "promocionesId",
                    label: "Lista de promoción: ",
                  }}
                  max={100000}
                  min={10}
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
                    name: "rfc",
                    label: "RFC ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Código P: ",
                  }}
                  max={1000000}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado ",
                  }}
                  max={100}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "ciudad",
                    label: "Municipio ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "razonSocial",
                    label: "Razón social: ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <SelectInput
                  formProps={{
                    name: "metodoDePagoId",
                    label: "Método de pago: ",
                  }}
                  readonly={readonly}
                  required
                  options={paymentMethodOptions}
                />
                <SelectInput
                  formProps={{
                    name: "formaDePagoId",
                    label: "Forma de pago: ",
                  }}
                  readonly={readonly}
                  options={paymentOptions}
                />
                <TextInput
                  formProps={{
                    name: "limiteDeCredito",
                    label: "Límite de crédito: ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "diasCredito",
                    label: "Días de crédito: ",
                  }}
                  max={99}
                  min={1}
                  readonly={readonly}
                />
                <SelectInput
                  formProps={{
                    name: "cfdiId",
                    label: "CFDI: ",
                  }}
                  readonly={readonly}
                  options={cfdiOptions}
                />
                <TextInput
                  formProps={{
                    name: "numeroDeCuenta",
                    label: "Número de cuenta: ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <SelectInput
                  formProps={{
                    name: "bancoId",
                    label: "Banco: ",
                  }}
                  readonly={readonly}
                  options={bankOptions}
                />
              </Col>
            </Row>
          </Form>

          <Row>
            <Divider className="header-divider" />
            <Col md={24} sm={12}>
              <Fragment>
                <CompanyFormTableHeader
                  handleCompanyPrint={handleCompanyPrint}
                  formContact={formContact}
                  contacts={contacts}
                  setFilteredContacts={setFilteredContacts}
                />
              </Fragment>
              <Divider className="header-divider" />
              <Form<IContactForm>
                {...formItemLayout}
                form={formContact}
                name="contact"
                onFinish={onFinishContact}
                layout="vertical"
                // initialValues={valuesContact}
                scrollToFirstError
                onFieldsChange={() => {
                  setDisabled(
                    !formContact.isFieldsTouched() ||
                      formContact.getFieldsError().filter(({ errors }) => errors.length).length > 0
                  );
                }}
              >
                <Row gutter={16}>
                  <Col md={6} sm={24}>
                    <TextInput
                      formProps={{
                        name: "nombre",
                        label: "Nombre ",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                      type="string"
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <TextInput
                      formProps={{
                        name: "correo",
                        label: "Correo ",
                      }}
                      max={100}
                      readonly={readonly}
                      type="email"
                    />
                  </Col>
                  <Col md={6} sm={24}>
                    <MaskInput
                      formProps={{
                        name: "telefono",
                        label: "Teléfono",
                      }}
                      mask={[
                        /[0-9]/,
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                        "-",
                        /[0-9]/,
                        /[0-9]/,
                      ]}
                      readonly={readonly}
                    />
                  </Col>
                  <Col md={6} sm={24}>
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
                </Row>
              </Form>

              <Table<IContactForm>
                size="large"
                rowKey={(record) => record.tempId ?? record.id}
                columns={columns.slice(0, 5)}
                dataSource={[...filteredContacts]}
              />
            </Col>
          </Row>
        </div>
      </div>
      <Divider />
    </Spin>
  );
};

export default observer(CompanyForm);
