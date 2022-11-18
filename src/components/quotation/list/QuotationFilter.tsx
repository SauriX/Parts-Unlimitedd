import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IQuotationFilter } from "../../../app/models/quotation";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
import "./css/index.css";

const QuotationFilter = () => {
  const { quotationStore, optionStore } = useStore();
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { getQuotations } = quotationStore;

  const [form] = useForm<IQuotationFilter>();

  const selectedCity = Form.useWatch("ciudad", form);

  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursales", []);
  }, [branchCityOptions, form, selectedCity]);

  const onFinish = (values: IQuotationFilter) => {
    const filter = { ...values };

    if (filter.fechaAlta && filter.fechaAlta.length > 1) {
      filter.fechaAInicial = filter.fechaAlta[0].utcOffset(0, true);
      filter.fechaAFinal = filter.fechaAlta[1].utcOffset(0, true);
    }

    if (filter.fechaNacimiento && filter.fechaNacimiento.length > 1) {
      filter.fechaNInicial = filter.fechaNacimiento[0].utcOffset(0, true);
      filter.fechaNFinal = filter.fechaNacimiento[1].utcOffset(0, true);
    }

    getQuotations(filter);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IQuotationFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={{ fechaAlta: [moment(), moment()] }}
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput
              formProps={{ name: "fechaAlta", label: "Fecha de alta" }}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "expediente",
                label: "Paciente",
              }}
              placeholder="Expediente / Nombre / Código de barras / Huella digital"
            />
          </Col>
          <Col span={8}>
            <DateRangeInput
              formProps={{
                name: "fechaNacimiento",
                label: "Fecha nacimiento",
              }}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{ name: "correoTelefono", label: "Teleéfono/Correo" }}
            />
          </Col>
          <Col span={8}>
            <Form.Item label="Sucursales" className="no-error-text" help="">
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
                        name: "sucursales",
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
          <Col span={8} style={{ textAlign: "right" }}>
            <Button
              key="clean"
              onClick={() => {
                form.resetFields();
              }}
            >
              Limpiar
            </Button>
            <Button
              key="filter"
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(QuotationFilter);