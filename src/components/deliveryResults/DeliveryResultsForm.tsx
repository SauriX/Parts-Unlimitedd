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

const DeliveryResultsForm = () => {
  const [form] = Form.useForm();

  const { requestStore, optionStore, massResultSearchStore, profileStore } =
    useStore();

  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    departmentAreaOptions,
    // cityOptions,
    CityOptions,
    getCityOptions,
    BranchOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
    getBranchOptions,
    getDepartmentAreaOptions,
  } = optionStore;
  const { profile } = profileStore;
  const {
    clearFormDeliverResult,
    clearRequests,
    getAllCaptureResults,
    requests,
    setFormDeliverResult,
  } = massResultSearchStore;

  const selectedCity = Form.useWatch("ciudad", form);
  const selectedDepartment = Form.useWatch("departament", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  const { getRequests } = requestStore;
  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
    getDepartmentAreaOptions();
    getBranchOptions();
    getCityOptions();
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
    if(selectedCity!=undefined && selectedCity !=null){
      var branhces =branchCityOptions.filter((x) => selectedCity.includes(x.value.toString()))
    var  options = branhces.flatMap(x=> (x.options== undefined?[]:x.options ));
      setBranchOptions(
        options
      );
    }
    form.setFieldValue("sucursalId", []);
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
  useEffect(() => {
    const formValues = form.getFieldsValue();
    formValues.fechaInicial = formValues.fechas[0].utcOffset(0, true);
    formValues.fechaFinal = formValues.fechas[1].utcOffset(0, true);
    getAllCaptureResults(formValues);
  }, []);

  const onFinish = async (newFormValues: any) => {
    const formValues = {
      ...newFormValues,
      fechaFinal: newFormValues.fechas[1].utcOffset(0, true),
      fechaInicial: newFormValues.fechas[0].utcOffset(0, true),
    };
    await getAllCaptureResults(formValues);
    setFormDeliverResult(formValues);
  };
  const limpiaFormulario = () => {
    form.resetFields();
    clearRequests();
    clearFormDeliverResult();
  };

  return (
    <>
      <Row justify="end" gutter={[24, 12]} className="filter-buttons">
        <Col span={24}>
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              limpiaFormulario();
            }}
          >
            Limpiar
          </Button>
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              form.submit();
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
                formProps={{ label: "Fechas", name: "fechas" }}
                disableAfterDates
              />
            </Col>

            <Col span={8}>
              <TextInput
                formProps={{ name: "clave", label: "Clave/Paciente" }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                form={form}
                multiple
                formProps={{ label: "Compañias", name: "companias" }}
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
                formProps={{ label: "Médicos", name: "medicos" }}
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
                formProps={{ label: "Procedencias", name: "procedencias" }}
                options={originOptions}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default observer(DeliveryResultsForm);
