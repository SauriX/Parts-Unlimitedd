import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useKeyPress } from "../../../app/hooks/useKeyPress";
import { IGeneralForm } from "../../../app/models/general";
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
  const { requestStore, optionStore, profileStore, generalStore } = useStore();
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    departmentOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentOptions,
  } = optionStore;
  const { profile, getProfile } = profileStore;
  const { getRequests, lastViewedFrom } = requestStore;
  const { setGeneralFilter, generalFilter } = generalStore;

  const [form] = useForm<IGeneralForm>();

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [dateType, setDateType] = useState<number>(1);

  useKeyPress("L", form.submit);

  useEffect(() => {
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
    getProfile();
  }, [getMedicOptions, getCompanyOptions, getDepartmentOptions, getProfile]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

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
    const defaultCode = !lastViewedFrom
      ? undefined
      : lastViewedFrom.from === "requests"
      ? undefined
      : lastViewedFrom.code;

    if (!profile || !profile.sucursal || branchCityOptions.length === 0) return;
    const profileBranch = profile.sucursal;
    const userCity = branchCityOptions
      .find((x) => x.options!.some((y) => y.value === profileBranch))
      ?.value?.toString();

    const filter = {
      ...generalFilter,
      buscar: defaultCode ?? generalFilter.buscar,
      ciudad: !generalFilter.cargaInicial ? generalFilter.ciudad : [userCity!],
      sucursalId: !generalFilter.cargaInicial
        ? generalFilter.sucursalId
        : [profileBranch],
    };
    form.setFieldsValue(filter);
    filter.cargaInicial = false;

    setGeneralFilter({ ...filter, tipoFecha: 1 });
    getRequests({ ...filter, tipoFecha: 1 });
  }, [branchCityOptions]);

  const onFinish = (values: IGeneralForm) => {
    setGeneralFilter(values);
    getRequests(values);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IGeneralForm>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{ tipoFecha: 1, fecha: [moment(), moment()] }}
        size="small"
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <SelectInput
              formProps={{
                name: "tipoFecha",
                label: "Fecha de",
              }}
              onChange={(value) => setDateType(value)}
              options={[
                { value: 1, label: "Fecha de Creación" },
                { value: 2, label: "Fecha de Entrega" },
              ]}
            />
          </Col>
          <Col span={8}>
            <DateRangeInput
              formProps={{ name: "fecha", label: "Fechas" }}
              disableAfterDates={dateType == 1}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{ name: "buscar", label: "Clave/Paciente" }}
              autoFocus
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
