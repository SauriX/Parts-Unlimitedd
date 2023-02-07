import { Button, Col, Form, Row, Input, Checkbox, Radio, Divider } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
import { useNavigate } from "react-router-dom";
import alerts from "../../../app/util/alerts";
import { toJS } from "mobx";
import { useParams } from "react-router-dom";

const { Search } = Input;

type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceComapnyForm = () => {
  let { id, tipo } = useParams<UrlParams>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { optionStore, invoiceCompanyStore, profileStore } = useStore();
  const [formCreate] = Form.useForm();
  const selectedCity = Form.useWatch("ciudad", form);
  const isInvoice = Form.useWatch("isInvoice", formCreate);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [serieOptions, setSerieOptions] = useState<IOptions[]>([]);
  const [checkedValues, setCheckedValues] = useState<any[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [requiredValues, setRequiredValues] = useState<boolean>(true);

  const { profile } = profileStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
    companyOptions,
    getCompanyOptions,
    invoiceSeriesOptions,
    getInvoiceSeriesOptions,
  } = optionStore;
  const {
    getInvoicesCompany,
    isSameCommpany,
    selectedRows,
    setSerie,
    saveFilterDate,
    printReceipt,
  } = invoiceCompanyStore;

  useEffect(() => {
    onFinish(form.getFieldsValue());
  }, [tipo]);
  useEffect(() => {
    getInvoiceSeriesOptions(profile?.sucursal!);
    getBranchCityOptions();
    getCompanyOptions();
    onFinish(form.getFieldsValue());
  }, []);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    var options:IOptions[] =[]; 

    if(selectedCity!=undefined && selectedCity !=null){
      var branhces =branchCityOptions.filter((x) => selectedCity.includes(x.value.toString()))
      branhces.forEach(x=>x.options!.forEach(y=> options.push(y)));
      console.log(options,"option");
    
      setBranchOptions(
        options
      );
    }

    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const facturasOptions: IOptions[] = [
    { label: "Solicitudes facturadas", value: "facturadas" },
    { label: "Solicitudes no facturadas", value: "noFacturadas" },
    { label: "Facturas canceladas", value: "canceladas" },
  ];
  const desgloceOptions: IOptions[] = [
    { label: "Simple", value: "simple" },
    { label: "Detalle", value: "detalle" },
    { label: "Concepto", value: "concepto" },
  ];

  const onFinish = async (newFormValues: any) => {
    const formValues = {
      ...newFormValues,
      tipoFactura: checkedValues,
      fechaFinal: newFormValues.fechas[1].utcOffset(0, true),
      fechaInicial: newFormValues.fechas[0].utcOffset(0, true),
      facturaMetodo: tipo,
    };
    saveFilterDate(newFormValues.fechas);
    getInvoicesCompany(formValues);
  };
  const createInvoice = async (formValues: any) => {
    if (!selectedRows.length) {
      alerts.warning("No solicitudes seleccionadas");
      return;
    }
    if (!isSameCommpany) {
      alerts.warning(
        "Las solicitudes seleccionadas no tienen la misma procedencia"
      );
      return;
    }

    let requestsWithInvoiceCompany: any[] = [];
    selectedRows.forEach((request) => {
      if (request.facturas.some((invoice: any) => invoice.tipo === tipo)) {
        requestsWithInvoiceCompany.push(request);
      }
    });

    if (!!requestsWithInvoiceCompany.length && isInvoice === "Factura") {
      alerts.confirmInfo(
        "Solicitudes facturadas",
        <>
          <Col>
            <div>
              Alguna de las solicitudes seleccionadas ya se encuentran
              procesadas en una factura:
            </div>
            {requestsWithInvoiceCompany.map((request) => {
              return (
                <div>
                  {request?.clave} -{" "}
                  {
                    request?.facturas.find(
                      (invoice: any) => invoice.tipo === "Compañia"
                    )?.facturapiId
                  }
                </div>
              );
            })}
          </Col>
        </>,
        async () => {}
      );
    }

    if (!requestsWithInvoiceCompany.length || isInvoice === "Recibo") {
      if (formValues.isInvoice === "Factura") {
        if (tipo === "company") {
          navigate(`/invoice/company/new`);
        }
        if (tipo === "request") {
          console.log("hgolaaaaaa");
          navigate(`/invoice/request/new`);
        }
      } else {
        let solicitudesId = selectedRows.map((row) => row.solicitudId);
        let receiptCompanyData = {
          sucursal: "MONTERREY", // "SUCURSAL MONTERREY"
          folio: "",
          atiende: "",
          usuario: "",
          Contraseña: "",
          ContactoTelefono: "",
          SolicitudesId: solicitudesId,
        };
        printReceipt(receiptCompanyData);
      }
    }
  };
  return (
    <>
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button key="clean" onClick={(e) => {}}>
            Limpiar
          </Button>
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              form.submit();
            }}
          >
            Filtrar
          </Button>
        </Col>
      </Row>

      <div className="status-container" style={{ marginBottom: 12 }}>
        <Form<any>
          {...formItemLayout}
          form={form}
          name="invoiceCompany"
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
        >
          <Row>
            <Col span={20}>
              <Row gutter={[0, 12]}>
                <Col span={8}>
                  <DateRangeInput
                    formProps={{ label: "Fechas", name: "fechas" }}
                    disableAfterDates
                  />
                </Col>
                <Col span={8}>
                  <TextInput formProps={{ name: "buscar", label: "Buscar" }} />
                </Col>

                <Col span={8}>
                  {tipo === "company" && (
                    <SelectInput
                      form={form}
                      multiple
                      formProps={{ label: "Compañias", name: "companias" }}
                      options={companyOptions}
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Form.Item label="Sucursal" className="no-error-text" help="">
                    <Input.Group>
                      <Row gutter={8}>
                        <Col span={12}>
                          <SelectInput
                          form={form}
                            formProps={{
                              name: "ciudad",
                              label: "Ciudad",
                              noStyle: true,
                            }}
                            multiple
                            options={cityOptions}
                          />
                        </Col>
                        <Col span={12}>
                          <SelectInput
                            form={form}
                            formProps={{
                              name: "sucursalId",
                              label: "Sucursales",
                              noStyle: true,
                            }}
                            multiple
                            options={branchOptions}
                          />
                        </Col>
                      </Row>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <Row justify="center">
                <Row gutter={8} justify="center">
                  <Col span={12}>
                    <Checkbox.Group
                      options={facturasOptions}
                      onChange={(newChekedValues) => {
                        setCheckedValues(newChekedValues);
                      }}
                    />
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </Form>
        <Divider></Divider>
        <Form<any>
          {...formItemLayout}
          form={formCreate}
          name="invoiceCompanyCreate"
          onFinish={createInvoice}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
          onFieldsChange={() => {
            setDisabled(
              (!form.isFieldsTouched() ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0) &&
                isSameCommpany
            );
          }}
        >
          <Row justify="center">
            <Col span={20}>
              <Row gutter={[0, 12]} justify="center">
                <Col span={8}>
                  <Form.Item name="isInvoice" required>
                    <Row justify="center">
                      <Radio.Group>
                        <Radio value={"Factura"}>Factura</Radio>
                        <Radio value={"Recibo"}>Recibo</Radio>
                      </Radio.Group>
                    </Row>
                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <SelectInput
                    formProps={{
                      label: "Desglose por",
                      name: "tipoDesglose",
                    }}
                    options={desgloceOptions}
                    required={requiredValues}
                  />
                </Col> */}
                <Col span={8}>
                  <SelectInput
                    formProps={{ label: "Serie", name: "serie" }}
                    options={invoiceSeriesOptions}
                    onChange={(serie: any) => {
                      console.log("sereie", serie);
                      setSerie(serie);
                    }}
                    required={true}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <Row justify="end" style={{ marginTop: 10 }}>
          <Col span={2}>
            <Button
              onClick={() => {
                formCreate.submit();
              }}
              // disabled={disabled}
            >
              Generar
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default observer(InvoiceComapnyForm);
