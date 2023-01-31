import { Button, Col, Collapse, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { IClinicResultForm } from "../../app/models/clinicResults";
import { IOptions } from "../../app/models/shared";
import {
  originOptions,
  studyStatusOptions,
  urgencyOptions,
} from "../../app/stores/optionStore";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";

const ClinicResultsFilter = () => {
  const { optionStore, clinicResultsStore,profileStore } = useStore();
  const { getAll, setFormValues, clearFilter } = clinicResultsStore;
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    studiesOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getStudiesOptions,
    areaByDeparmentOptions,
    getAreaByDeparmentOptions
  } = optionStore;
  const {profile} = profileStore;
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [studyFilter, setStudyFilter] = useState<any[]>(studiesOptions);

  const selectedCity = Form.useWatch("ciudad", form);
  const selectedDepartment = Form.useWatch("departamento", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    const update = async () => {
      getBranchCityOptions();
      getMedicOptions();
      getCompanyOptions();
      getAreaByDeparmentOptions();
      await getStudiesOptions();
      setStudyFilter(studiesOptions);
    };
    update();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getStudiesOptions,
    getAreaByDeparmentOptions,
  ]);

  useEffect(() => {
    const branchesFiltered: IOptions[] = [];
    branchCityOptions.forEach((bco) => {
      let sucursalesDisponibles = bco.options?.filter((x) =>
        profile?.sucursales.includes("" + x.value)
      );
      if (!!sucursalesDisponibles?.length) {
        let copy = {
          ...bco,
          options: sucursalesDisponibles,
        };
        branchesFiltered.push(copy);
      }
    });
    setCityOptions(
      branchesFiltered.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    const branchesFiltered: IOptions[] = [];
    branchCityOptions.forEach((bco) => {
      let sucursalesDisponibles = bco.options?.filter((x) =>
        profile?.sucursales.includes("" + x.value)
      );
      if (!!sucursalesDisponibles?.length) {
        let copy = {
          ...bco,
          options: sucursalesDisponibles,
        };
        branchesFiltered.push(copy);
      }
    });
    setCityOptions(
      branchesFiltered.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions
        .filter((x) => selectedCity?.includes(x.value as string))
        .flatMap((x) => x.options ?? [])
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    setDepartmentOptions(
      areaByDeparmentOptions.map((x) => ({ value: x.value, label: x.label }))
    );
    
  }, [areaByDeparmentOptions]);

  useEffect(() => {
    setAreaOptions(
      areaByDeparmentOptions
        .filter((x) => selectedDepartment?.includes(x.value as number))
        .flatMap((x) => x.options ?? [])
    );
    form.setFieldValue("area", []);
    console.log("areaByDeparmentOptions", areaByDeparmentOptions)
  }, [areaByDeparmentOptions, form, selectedDepartment]);

  const onFinish = async (newFormValues: IClinicResultForm) => {
    setLoading(true);

    const filter = { ...newFormValues };
    setFormValues(newFormValues);
    getAll(filter);
    setLoading(false);
  };

  return (
    <>
      <Row justify="end" gutter={[24, 12]} className="filter-buttons">
        <Col span={24}>
          <Button
            key="clean"
            onClick={(e) => {
              clearFilter();
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
            Buscar
          </Button>
        </Col>
      </Row>
      <div className="status-container">
        <Form<IClinicResultForm>
          {...formItemLayout}
          form={form}
          name="clinicResults"
          onFinish={onFinish}
          initialValues={{
            fecha: [
              moment(Date.now()).utcOffset(0, true),
              moment(Date.now()).utcOffset(0, true),
            ],
          }}
          scrollToFirstError
        >
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[0, 12]}>
                <Col span={8}>
                  <DateRangeInput
                    formProps={{ label: "Fecha", name: "fecha" }}
                    required={true}
                    disableAfterDates
                  />
                </Col>
                <Col span={8}>
                  <TextInput
                    formProps={{
                      name: "buscar",
                      label: "Buscar",
                    }}
                    onPressEnter={() => {
                      form.submit();
                    }} 
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
                    options={studyStatusOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <Form.Item label="Áreas" className="no-error-text" help="">
                    <Input.Group>
                      <Row gutter={8}>
                        <Col span={12}>
                          <SelectInput
                            form={form}
                            formProps={{
                              name: "departamento",
                              label: "Departamento",
                              noStyle: true,
                            }}
                            multiple
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
                      name: "estudio",
                      label: "Estudio",
                    }}
                    multiple
                    options={studyFilter}
                  ></SelectInput>
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
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default observer(ClinicResultsFilter);
