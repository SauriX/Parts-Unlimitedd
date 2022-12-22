import { Button, Col, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
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
import { IDeliverResultsForm } from "../../app/models/massResultSearch";
import React from "react";

const DeliveryResultsForm = () => {
  const [form] = Form.useForm();

  const { requestStore, optionStore, massResultSearchStore } = useStore();

  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    departmentOptions,
    // cityOptions,
    CityOptions,
    getCityOptions,
    BranchOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
    getBranchOptions,
  } = optionStore;

  const {
    clearFormDeliverResult,
    clearRequests,
    getAllCaptureResults,
    requests,
    setFormDeliverResult,
  } = massResultSearchStore;

  const { getRequests } = requestStore;
  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
    getBranchOptions();
    getCityOptions();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
  ]);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    formValues.fechaInicial = formValues.fechas[0].utcOffset(0, true);
    formValues.fechaFinal = formValues.fechas[1].utcOffset(0, true);
    getAllCaptureResults(formValues);
  }, []);

  const onFinish = async (newFormValues: any) => {
    console.log("newFormValues", newFormValues);
    const formValues = {
      ...newFormValues,
      fechaFinal: newFormValues.fechas[1].utcOffset(0, true),
      fechaInicial: newFormValues.fechas[0].utcOffset(0, true),
    };
    console.log("formValues", formValues);
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
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              limpiaFormulario();
            }}
          >
            Limpiar
          </Button>
          ,
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
                multiple
                formProps={{ label: "Departamentos", name: "departamentos" }}
                options={departmentOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{ label: "Compañias", name: "companias" }}
                options={companyOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput
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
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{
                  label: "Tipo de solicitud",
                  name: "tipoSolicitud",
                }}
                options={urgencyOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{ label: "Estatus", name: "estatus" }}
                options={studyStatusOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{ label: "Médicos", name: "medicos" }}
                options={medicOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{ label: "Ciudades", name: "ciudades" }}
                options={CityOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              {/* <SelectInput
                multiple
                formProps={{ label: "Sucursales", name: "sucursales" }}
                options={branchCityOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              /> */}
              <SelectInput
                multiple
                formProps={{ label: "Sucursales", name: "sucursales" }}
                options={BranchOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                multiple
                formProps={{ label: "Procedencias", name: "procedencias" }}
                options={originOptions}
                onChange={(value: any, option: any) => {
                  console.log("areas", value, option);
                }}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default observer(DeliveryResultsForm);
