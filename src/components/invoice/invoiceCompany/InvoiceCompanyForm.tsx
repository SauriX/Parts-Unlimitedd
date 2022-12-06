import { Button, Col, Form, Row, Input, Checkbox, Radio, Divider } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";

const { Search } = Input;

const InvoiceComapnyForm = () => {
  const { optionStore } = useStore();
  const { companyOptions, getCompanyOptions } = optionStore;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const options = [
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange" },
  ];
  return (
    <>
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              //   limpiaFormulario();
            }}
          >
            Limpiar
          </Button>
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              //   form.submit();
            }}
          >
            Filtrar
          </Button>
        </Col>
      </Row>

      <div className="status-container" style={{ marginBottom: 12 }}>
        <Form
          {...formItemLayout}
          form={form}
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()], tipoFecha: 1 }}
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
                            options={[]}
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
                            options={[]}
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
          <Divider></Divider>
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
                    required
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
          <Row justify="end">
            <Col span={2}>
              <Button>Generar</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default observer(InvoiceComapnyForm);
