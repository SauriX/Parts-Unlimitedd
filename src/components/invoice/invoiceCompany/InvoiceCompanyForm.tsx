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
    if (selectedCity != undefined && selectedCity != null) {
      var branhces = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branhces.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
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
      // if (false) {
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
                      (invoice: any) => invoice.tipo === tipo
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
      // if (true) {
      if (formValues.isInvoice === "Factura") {
        if (tipo === "company") {
          navigate(`/invoice/company/new`);
        }
        if (tipo === "request") {
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
      <div className="status-container" style={{ marginBottom: 12 }}>
        <Form<any>
          {...formItemLayout}
          form={form}
          name="invoiceCompany"
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
        >
          <Row gutter={[0, 12]}>
            <Col span={8}>
              <DateRangeInput
                formProps={{ label: "Fechas", name: "fechas" }}
                disableAfterDates
              />
            </Col>

            {tipo === "company" && (
              <Col span={8}>
                <SelectInput
                  form={form}
                  multiple
                  formProps={{ label: "Compañias", name: "companias" }}
                  options={companyOptions}
                />
              </Col>
            )}
            <Col span={8}>
              <Form.Item label="Sucursal" className="no-error-text" help="">
                <Input.Group>
                  <Row gutter={8}>
                    <Col span={12}>
                      <SelectInput
                        formProps={{
                          name: "ciudad",
                          label: "Ciudad",
                          noStyle: true,
                        }}
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
            <Col span={8}>
              <TextInput
                formProps={{ name: "buscar", label: "Buscar" }}
                autoFocus
              />
            </Col>
          </Row>
          <Row gutter={[0, 12]} style={{ paddingLeft: 60, paddingTop: 10 }}>
            <Col span={12}>
              <Checkbox.Group
                options={facturasOptions}
                onChange={(newChekedValues) => {
                  setCheckedValues(newChekedValues);
                }}
              />
            </Col>
          </Row>
        </Form>

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
        ></Form>
        <Row justify="end" style={{ marginBottom: 10 }}>
          <Col>
            <Button
              key="clean"
              onClick={(e) => {
                form.resetFields();
              }}
            >
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
      </div>
    </>
  );
};

export default observer(InvoiceComapnyForm);
