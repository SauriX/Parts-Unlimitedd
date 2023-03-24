import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IRequestFilter } from "../../../app/models/request";
import { IOptions } from "../../../app/models/shared";
import {
  originOptions,
  studyStatusOptions,
  urgencyOptions,
} from "../../../app/stores/optionStore";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
import "./css/index.css";

const ReportFilter = () => {
  const { reportStudyStore, optionStore } = useStore();
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    departmentOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
  } = optionStore;
  const { filter, setFilter, getRequests } = reportStudyStore;

  const [form] = useForm<IRequestFilter>();

  const selectedCity = Form.useWatch("ciudad", form);

  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
  ]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);
  useEffect(() => {
    form.setFieldsValue(filter);
  }, [form, filter]);
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
    form.setFieldValue("sucursales", []);
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    var filtered = filter;
    filtered.tipoFecha = 2;
    getRequests(filtered);
  }, [getRequests]);
  useEffect(() => {
    form.setFieldsValue(filter);
  }, [form]);
  const onFinish = (values: IRequestFilter) => {
    const filtered = { ...values };
    filtered.tipoFecha = 2;
    if (filtered.fechas && filtered.fechas.length > 1) {
      filtered.fechaInicial = filtered.fechas[0].utcOffset(0, true);
      filtered.fechaFinal = filtered.fechas[1].utcOffset(0, true);
    }

    setFilter(filtered);
    getRequests(filtered);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IRequestFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{ tipoFecha: 1, fechas: [moment(), moment()] }}
        size="small"
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput formProps={{ name: "fechas", label: "Fechas de entrega" }} />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{ name: "clave", label: "Clave/Paciente" }}
              autoFocus={true}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "procedencias", label: "Procedencia" }}
              multiple
              options={originOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "urgencias", label: "Tipo solicitud" }}
              multiple
              options={urgencyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "estatus", label: "Estatus" }}
              multiple
              options={studyStatusOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "departamentos", label: "Departamento" }}
              multiple
              options={departmentOptions}
            />
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
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "compañias", label: "Compañia" }}
              multiple
              options={companyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "medicos", label: "Médico" }}
              multiple
              options={medicOptions}
            />
          </Col>
          <Col span={16}></Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Button key="clean" htmlType="reset">
              Limpiar
            </Button>
            <Button key="filter" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(ReportFilter);
