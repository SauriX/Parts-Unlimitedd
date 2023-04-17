import { Button, Checkbox, Col, Form, Row } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IInvoicesFreeFilter } from "../../../app/models/Invoice";
import { urgencyOptions } from "../../../app/stores/optionStore";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

const InvoiceGlobalForm = () => {
  const [form] = Form.useForm();
  const { optionStore, invoiceCompanyStore } = useStore();
  const [checkedValues, setCheckedValues] = useState<any>();

  const {
    sucursales,
    companyOptions,
    getSucursalesOptions,
    getCompanyOptions,
    getMedicOptions,
    medicOptions,
    getDepartmentOptions,
    departmentOptions,
  } = optionStore;
  const { getInvoicesCompany, setFormValues, formValues } = invoiceCompanyStore;
  useEffect(() => {
    getSucursalesOptions();
    getCompanyOptions();
    getMedicOptions();
    getDepartmentOptions();
  }, []);
  useEffect(() => {
    form.resetFields();
    form.submit();
  }, []);
  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [form, formValues]);
  const onFinish = async (newFormValues: any) => {
    const formValues = {
      ...newFormValues,

      fechaFinal: newFormValues.fechas[1],
      fechaInicial: newFormValues.fechas[0],
      facturaMetodo: "request",
      sucursalId: [],
      tipoFactura: [],
    };
    setFormValues(newFormValues);
    getInvoicesCompany(formValues);
  };

  return (
    <>
      <div className="status-container">
        <Form<any>
          {...formItemLayout}
          form={form}
          name="invoiceFree"
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
        >
          <Row justify="center" align="top">
            <Col span={8}>
              <DateRangeInput
                formProps={{
                  name: "fechas",
                  label: "Fechas",
                }}
                disableAfterDates
                style={{ marginBottom: 10 }}
              />

              {/* <SelectInput
                formProps={{
                  name: "procedencia",
                  label: "Procedencia",
                }}
                options={sucursales}
                style={{ marginBottom: 10 }}
              /> */}
              <SelectInput
                form={form}
                formProps={{
                  name: "departamentos",
                  label: "Departamento",
                }}
                multiple
                options={departmentOptions}
                style={{ marginBottom: 10 }}
              />
              <SelectInput
                multiple
                form={form}
                formProps={{
                  name: "medicos",
                  label: "Médico",
                }}
                options={medicOptions}
                style={{ marginBottom: 10 }}
              />
            </Col>
            <Col span={8}>
              <TextInput
                formProps={{
                  name: "buscar",
                  label: "Buscar",
                }}
                style={{ marginBottom: 10 }}
              />
              <SelectInput
                multiple
                form={form}
                formProps={{
                  name: "sucursalId",
                  label: "Sucursal",
                }}
                options={sucursales}
                style={{ marginBottom: 10 }}
              />
              {/* <SelectInput
                formProps={{
                  name: "compania",
                  label: "Compañia",
                }}
                options={companyOptions}
                style={{ marginBottom: 10 }}
              /> */}
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                form={form}
                formProps={{
                  name: "urgencias",
                  label: "Tipo de solicitud",
                }}
                options={urgencyOptions}
                style={{ marginBottom: 10 }}
              />
              <SelectInput
                form={form}
                multiple
                formProps={{
                  name: "tipoFactura",
                  label: "Estatus",
                }}
                options={[
                  { label: "Facturadas", value: "facturadas" },
                  { label: "No facturadas", value: "noFacturadas" },
                  { label: "Canceladas", value: "canceladas" },
                ]}
                style={{ marginBottom: 10 }}
              />

              {/* <Row justify="center">
                <Checkbox.Group
                  options={[
                    { label: "Compañia", value: "company" },
                    { label: "Solicitud", value: "request" },
                  ]}
                  onChange={(newChekedValues) => {
                    setCheckedValues(newChekedValues);
                  }}
                />
              </Row> */}
            </Col>
          </Row>
          <Row justify="end">
            <Col span={4} offset={20}>
              <Button onClick={() => form.resetFields()}>Limpiar</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Filtrar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default observer(InvoiceGlobalForm);
