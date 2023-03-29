import { Button, Col, Form, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import {
  originOptions,
  studyStatusOptions,
  urgencyOptions,
} from "../../app/stores/optionStore";
import { IOptions } from "../../app/models/shared";
import { IGeneralForm } from "../../app/models/general";

const DeliveryResultsForm = () => {
  const [form] = Form.useForm();
  const { optionStore, massResultSearchStore, profileStore, generalStore } =
    useStore();

  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    areaByDeparmentOptions,
    getCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
    getBranchOptions,
    getAreaByDeparmentOptions,
  } = optionStore;
  const { profile } = profileStore;
  const { getAllCaptureResults } = massResultSearchStore;
  const { generalFilter, setGeneralFilter } = generalStore;

  const selectedCity = Form.useWatch("ciudad", form);
  const selectedDepartment = Form.useWatch("departamento", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
    getAreaByDeparmentOptions();
    getBranchOptions();
    getCityOptions();
  }, [
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
    getAreaByDeparmentOptions,
  ]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

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
    if (!profile || !profile.sucursal || branchCityOptions.length === 0) return;
    const profileBranch = profile.sucursal;
    const userCity = branchCityOptions
      .find((x) => x.options!.some((y) => y.value === profileBranch))
      ?.value?.toString();

    const filter = {
      ...generalFilter,
      ciudad: !generalFilter.cargaInicial
        ? generalFilter.ciudad
        : [userCity as string],
      sucursalId: !generalFilter.cargaInicial
        ? generalFilter.sucursalId
        : [profileBranch],
    };
    form.setFieldsValue(filter);
    filter.cargaInicial = false;

    setGeneralFilter(filter);
    getAllCaptureResults(filter);
  }, [branchCityOptions]);

  const onFinish = async (newFormValues: IGeneralForm) => {
    await getAllCaptureResults(newFormValues);
    setGeneralFilter(newFormValues);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IGeneralForm>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={{ fecha: [moment(), moment()], tipoFecha: 1 }}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            event.stopPropagation();
            form.submit();
          }
        }}
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <SelectInput
              formProps={{
                name: "tipoFecha",
                label: "Fecha de",
              }}
              options={[
                { value: 1, label: "Fecha de Creación" },
                { value: 2, label: "Fecha de Entrega" },
              ]}
            />
          </Col>
          <Col span={8}>
            <DateRangeInput
              formProps={{ label: "Fechas", name: "fecha" }}
              disableAfterDates
            />
          </Col>

          <Col span={8}>
            <TextInput
              formProps={{ name: "buscar", label: "Clave/Paciente" }}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              multiple
              formProps={{ label: "Compañias", name: "compañiaId" }}
              options={companyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              multiple
              formProps={{
                label: "Medios de entrega",
                name: "mediosEntrega",
              }}
              options={[
                { value: "Whatsapp", label: "Whatsapp" },
                { value: "Correo", label: "Correo" },
                // { value: "Fisico", label: "Fisico" },
              ]}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              multiple
              formProps={{
                label: "Tipo de solicitud",
                name: "tipoSolicitud",
              }}
              options={urgencyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              multiple
              formProps={{ label: "Estatus", name: "estatus" }}
              options={studyStatusOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              multiple
              formProps={{ label: "Médicos", name: "medicoId" }}
              options={medicOptions}
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
              multiple
              formProps={{ label: "Procedencias", name: "procedencia" }}
              options={originOptions}
            />
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
export default observer(DeliveryResultsForm);
