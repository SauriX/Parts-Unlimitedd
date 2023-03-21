import "./css/changeStatus.less";
import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import {
  originOptions,
  samplingStudyOptions,
  urgencyOptions,
} from "../../app/stores/optionStore";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import moment from "moment";
import { IOptions } from "../../app/models/shared";
import { IGeneralForm } from "../../app/models/clinicResults";

const SamplingStudyFilter = () => {
  const { optionStore, samplingStudyStore, profileStore, clinicResultsStore } = useStore();
  const { getAll } = samplingStudyStore;
  const { setFormValues, formValues } = clinicResultsStore;
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    departmentAreaOptions,
    getDepartmentAreaOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;
  const { profile } = profileStore;
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const selectedCity = Form.useWatch("ciudad", form);
  const selectedDepartment = Form.useWatch("departament", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getDepartmentAreaOptions();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentAreaOptions,
  ]);

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [formValues, form]);

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
      var branhces = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branhces.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
    }
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    setDepartmentOptions(
      departmentAreaOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [departmentAreaOptions]);

  useEffect(() => {
    setAreaOptions(
      departmentAreaOptions.find((x) => x.value === selectedDepartment)
        ?.options ?? []
    );
    form.setFieldValue("area", []);
  }, [departmentAreaOptions, form, selectedDepartment]);

  const onFinish = async (newFormValues: IGeneralForm) => {
    setLoading(true);
    const filter = { ...newFormValues };
    setFormValues(newFormValues);
    getAll(filter);
    setLoading(false);
  };

  return (
    <div className="status-container">
      <Form<IGeneralForm>
        {...formItemLayout}
        form={form}
        name="requestedStudy"
        onFinish={onFinish}
        initialValues={{
          fecha: [
            moment(Date.now()).utcOffset(0, true),
            moment(Date.now()).utcOffset(0, true),
          ],
        }}
        scrollToFirstError
      >
        <Row justify="space-between" gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput
              formProps={{ label: "Fecha", name: "fecha" }}
              disableAfterDates={true}
              required
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
              }}
              autoFocus
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{
                name: "procedencia",
                label: "Procedencia",
              }}
              multiple
              options={originOptions}
            ></SelectInput>
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{
                name: "tipoSolicitud",
                label: "Tipo solicitud",
              }}
              multiple
              options={urgencyOptions}
            ></SelectInput>
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{
                name: "estatus",
                label: "Estatus",
              }}
              multiple
              options={samplingStudyOptions}
            ></SelectInput>
          </Col>
          <Col span={8}>
            <Form.Item label="Áreas" className="no-error-text" help="">
              <Input.Group>
                <Row gutter={8}>
                  <Col span={12}>
                    <SelectInput
                      formProps={{
                        name: "departament",
                        label: "Departamento",
                        noStyle: true,
                      }}
                      options={departmentOptions}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "area",
                        label: "Área",
                        noStyle: true,
                      }}
                      multiple
                      options={areaOptions}
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{
                name: "medicoId",
                label: "Médico",
              }}
              multiple
              options={medicOptions}
            ></SelectInput>
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
              formProps={{
                name: "compañiaId",
                label: "Compañía",
              }}
              multiple
              options={companyOptions}
            ></SelectInput>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button key="clean" htmlType="reset">
              Limpiar
            </Button>
            <Button key="filter" type="primary" htmlType="submit">
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(SamplingStudyFilter);
