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

const { Search } = Input;

const InvoiceComapnyForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { optionStore, invoiceCompanyStore } = useStore();
  const [formCreate] = Form.useForm();
  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const {
    branchCityOptions,
    getBranchCityOptions,
    companyOptions,
    getCompanyOptions,
  } = optionStore;
  const { getInvoicesCompany } = invoiceCompanyStore;
  useEffect(() => {
    getBranchCityOptions();
    getCompanyOptions();
  }, []);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const options = [
    { label: "Solicitudes facturadas", value: 1 },
    { label: "Facturas canceladas", value: 2 },
  ];

  const onFinish = async (newFormValues: any) => {
    const formValues = {
      fechaFinal: newFormValues.fechas[1].utcOffset(0, true),
      fechaInicial: newFormValues.fechas[0].utcOffset(0, true),
    };
    getInvoicesCompany(formValues);
    console.log("newFormValues", newFormValues);
  };
  const createInvoice = async (formValues: any) => {
    console.log("CREATE", formValues);
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
              console.log("click1");
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
                  />
                </Col>
                <Col span={8}>
                  <TextInput formProps={{ name: "buscar", label: "Buscar" }} />
                </Col>
                <Col span={8}>
                  <SelectInput
                    multiple
                    formProps={{ label: "Compañias", name: "companias" }}
                    options={companyOptions}
                  />
                </Col>
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
                <Form.Item className="no-error-text" help="">
                  <Row gutter={8} justify="center">
                    <Col span={12}>
                      <Checkbox.Group options={options} />
                    </Col>
                  </Row>
                </Form.Item>
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
        >
          <Row justify="center">
            <Col span={20}>
              <Row gutter={[0, 12]} justify="center">
                <Col span={8}>
                  <Row justify="center">
                    <Radio.Group>
                      <Radio value={1}>Factura</Radio>
                      <Radio value={2}>Recibo</Radio>
                    </Radio.Group>
                  </Row>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      label: "Desglose por",
                      name: "tipoDesglose",
                    }}
                    options={[]}
                    // required
                  />
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{ label: "Serie", name: "serie" }}
                    options={[]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <Row justify="end">
          <Col span={2}>
            <Button
              onClick={() => {
                navigate(`/invoice/create`);
                formCreate.submit();
              }}
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
