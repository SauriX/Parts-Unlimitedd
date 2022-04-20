import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Table,
} from "antd";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useStore } from "../../../app/stores/store";
import { Search, useNavigate, useSearchParams } from "react-router-dom";
import { ICompanyForm, CompanyFormValues } from "../../../app/models/company";
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



type CompanyFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const CompanyForm: FC<CompanyFormProps> = ({ id, componentRef, printing }) => {
  const { companyStore, optionStore, locationStore } = useStore();
  const { getById, create, update, getAll, company } = companyStore;
  const {
    paymentOptions,
    getpaymentOptions,
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

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<ICompanyForm>(new CompanyFormValues());

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
    const readCompany = async (id: number) => {
      setLoading(true);
      const company = await getById(id);

      if (company) {
        form.setFieldsValue(company);
        getLocation(company.codigoPostal.toString());
        setValues(company);
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
  }, [
    getpaymentOptions,
    getbankOptions,
    getcfdiOptions,
    getpaymentMethodOptions,
  ]);

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

    if (!company.idCompania) {
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
      const index = company.findIndex((x) => x.idCompania === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextCompany = (index: number) => {
    const companys = company[index];
    navigate(
      `/company/${companys?.idCompania}?mode=${searchParams.get(
        "mode"
      )}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    console.log(values);
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

  console.log("Table");
const { width: windowWidth } = useWindowDimensions();
const [searchState, setSearchState] = useState<ISearch>({
  searchedText: "",
  searchedColumn: "",
});

const columns: IColumns<IContactList> = [
  {
    ...getDefaultColumnProps("nombre", "Nombre", {
      searchState,
      setSearchState,
      width: "20%",
      windowSize: windowWidth,
    }),
  },
  {
    ...getDefaultColumnProps("telefono", "Telefono", {
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
    ...getDefaultColumnProps("activo", "Activo", {
      searchState,
      setSearchState,
      width: "10%",
      windowSize: windowWidth,
    }),
  },
  {
    key: "editar",
    dataIndex: "id",
    title: "Editar",
    align: "center",
    width: windowWidth < resizeWidth ? 100 : "10%",
    // render: (value) => (
    //   <IconButton
    //     title="Editar Contacto"
    //     icon={<EditOutlined />}
    //     onClick={() => {
    //       navigate(`/company/${value}?${searchParams}&mode=edit&search=${searchParams.get("search") ?? "all"}`);
    //     }}
        
    //   />
    // ),
  },
];

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
                    name: "procedencia",
                    label: "Procedencia. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "listaPrecioId",
                    label: "Lista de precio: ",
                  }}
                  max={100000}
                  min={1}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "promocionesId",
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
                    name: "rFC",
                    label: "RFC. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />

                <NumberInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Código P: ",
                  }}
                  max={9999999999}
                  min={1000}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado. ",
                  }}
                  max={100}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "ciudad",
                    label: "Municipio. ",
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
                <SelectInput //Crear y cambier field option, store a Metodo de pago
                  formProps={{
                    name: "metodoDePagoId",
                    label: "Método de pago: ",
                  }}
                  readonly={readonly}
                  required
                  options={paymentMethodOptions}
                />
                <SelectInput //Crear y cambier field option, store a Forma de pago
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
                    label: "Limite de crédito: ",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "diasCredito",
                    label: "Dias de crédito: ",
                  }}
                  max={99}
                  min={1}
                  readonly={readonly}
                />
                <SelectInput //Crear y cambier field option, store a CFDI
                  formProps={{
                    name: "cFDIId",
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
                <SelectInput //Crear y cambier field option, store a Banco
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
        </div>
      </div>
      <div>
       <Row>
      <Col md={24} sm={12} style={{marginRight: 20, textAlign: "center" }}>
      
      <Fragment>
      <CompanyFormTableHeader handleCompanyPrint={handleCompanyPrint} /> 
      </Fragment>
          {/*
            <Row>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                  type="string"
                />
                <TextInput
                  formProps={{
                    name: "telefono",
                    label: "Telefono. ",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                </Col>
                <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "Correo. ",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>
          </Row>*/}


        <Divider className="header-divider" />
        <Table<IContactList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 5)}
          pagination={false}
          dataSource={[...(values.contact??[])]}
          scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        />
         </Col>
    </Row>  
      </div>
    </Spin>
  );
};

export default observer(CompanyForm);
