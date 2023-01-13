import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
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

const RequestFilter = () => {
  const { requestStore, optionStore } = useStore();
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
  const { filter, setFilter, getRequests } = requestStore;

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
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursales", []);
  }, [branchCityOptions, form, selectedCity]);

  const onFinish = (values: IRequestFilter) => {
    const filter = { ...values };

    if (filter.fechas && filter.fechas.length > 1) {
      filter.fechaInicial = filter.fechas[0].utcOffset(0, true);
      filter.fechaFinal = filter.fechas[1].utcOffset(0, true);
    }

    setFilter(filter);
    getRequests(filter);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IRequestFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={filter}
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <SelectInput
              formProps={{
                name: "tipoFecha",
                label: "Fechas por",
              }}
              options={[
                { value: 1, label: "Solicitudes hechas" },
                { value: 2, label: "Solicitudes a entregar" },
              ]}
            />
          </Col>
          <Col span={8}>
            <DateRangeInput
              formProps={{ name: "fechas", label: "Fechas" }}
              disableAfterDates
            />
          </Col>
          <Col span={8}>
            <TextInput formProps={{ name: "clave", label: "Clave/Paciente" }} />
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
          <Col span={16} style={{ textAlign: "right" }}>
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

export default observer(RequestFilter);
