import { Button, Checkbox, Col, Form, Row } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IInvoicesFreeFilter } from "../../../app/models/Invoice";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

const InvoiceFreeForm = () => {
  const [form] = Form.useForm();
  const { optionStore, invoiceCompanyStore } = useStore();
  const [checkedValues, setCheckedValues] = useState<any>();

  const {
    sucursales,
    companyOptions,
    getSucursalesOptions,
    getCompanyOptions,
  } = optionStore;
  const { getInvoicesFree } = invoiceCompanyStore;
  useEffect(() => {
    getSucursalesOptions();
    getCompanyOptions();
  }, []);
  useEffect(() => {
    form.resetFields();
    form.submit();
  }, []);
  const onFinish = (newFormValues: IInvoicesFreeFilter) => {
    console.log("FORMULARIO", toJS(newFormValues));
    console.log("CHECKED VALUES", toJS(checkedValues));
    newFormValues.tipo = checkedValues;
    newFormValues.fechaInicial = newFormValues.fechas[0];
    newFormValues.fechaFinal = newFormValues.fechas[1];
    getInvoicesFree(newFormValues);
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
          <Row justify="center" align="middle">
            <Col span={8}>
              <SelectInput
                formProps={{
                  name: "sucursal",
                  label: "Sucursal",
                }}
                options={sucursales}
                style={{ marginBottom: 10 }}
              />
              <SelectInput
                formProps={{
                  name: "compania",
                  label: "Compañia",
                }}
                options={companyOptions}
                style={{ marginBottom: 10 }}
              />
            </Col>
            <Col span={8}>
              <DateRangeInput
                formProps={{
                  name: "fechas",
                  label: "Fechas",
                }}
                disableAfterDates
                style={{ marginBottom: 10 }}
              />
              <TextInput
                formProps={{
                  name: "buscar",
                  label: "Buscar",
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                form={form}
                multiple
                formProps={{
                  name: "estatus",
                  label: "Estatus",
                }}
                options={[
                  {
                    label: "Facturadas",
                    value: "Facturado",
                  },
                  {
                    label: "Canceladas",
                    value: "Cancelado",
                  },
                ]}
                style={{ marginBottom: 10 }}
              />

              <Row justify="center">
                <Checkbox.Group
                  options={[
                    { label: "Compañia", value: "company" },
                    { label: "Solicitud", value: "request" },
                  ]}
                  onChange={(newChekedValues) => {
                    setCheckedValues(newChekedValues);
                  }}
                />
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <Col span={4} offset={20}>
              <Button>Limpiar</Button>
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

export default observer(InvoiceFreeForm);
