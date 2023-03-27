import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IGeneralForm } from "../../../app/models/general";
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
  const { reportStudyStore, optionStore, generalStore, profileStore } = useStore();
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    areaByDeparmentOptions,
    getAreaByDeparmentOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;
  const { profile } = profileStore;
  const { getRequests } = reportStudyStore;
  const { generalFilter, setGeneralFilter } = generalStore;

  const [form] = useForm();
  const selectedCity = Form.useWatch("ciudad", form);
  const selectedDepartment = Form.useWatch("departamento", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getAreaByDeparmentOptions();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getAreaByDeparmentOptions,
  ]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      const findCity = branchCityOptions.find((x) =>
        x.options?.some((y) => y.value == profileBranch)
      )?.value;
      if (findCity) {
        form.setFieldValue("ciudad", [findCity]);
      }
      form.setFieldValue("sucursalId", [profileBranch]);
    }
  }, [branchCityOptions, form, profile]);
  
  useEffect(() => {
    if (selectedCity != undefined && selectedCity != null) {
      var branches = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branches.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
    }
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    form.setFieldsValue(generalFilter);
  }, [generalFilter, form]);

  useEffect(() => {
    setDepartmentOptions(
      areaByDeparmentOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [areaByDeparmentOptions]);

  useEffect(() => {
    setAreaOptions(
      areaByDeparmentOptions.find((x) => x.value === selectedDepartment)
        ?.options ?? []
    );
  }, [areaByDeparmentOptions, form, selectedDepartment]);

  useEffect(() => {
    let filtered = generalFilter;
    filtered.tipoFecha = 2;
    getRequests(filtered);
  }, [getRequests]);
  
  const onFinish = (values: IGeneralForm) => {
    const filtered = { ...values };
    filtered.tipoFecha = 2;

    setGeneralFilter(filtered);
    getRequests(filtered);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IRequestFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{ tipoFecha: 1, fecha: [moment(), moment()] }}
        size="small"
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput formProps={{ name: "fechas", label: "Fechas de entrega" }} />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{ name: "buscar", label: "Clave/Paciente" }}
              autoFocus={true}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "procedencia", label: "Procedencia" }}
              multiple
              options={originOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "tipoSolicitud", label: "Tipo solicitud" }}
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
              formProps={{ name: "departamento", label: "Departamento" }}
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
            <SelectInput
              form={form}
              formProps={{ name: "compañiaId", label: "Compañia" }}
              multiple
              options={companyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "medicoId", label: "Médico" }}
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
