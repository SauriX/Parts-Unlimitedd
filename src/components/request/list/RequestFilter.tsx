import { Button, Col, Form, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect } from "react";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IRequestFilter } from "../../../app/models/request";
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
  const { getRequests } = requestStore;

  const [form] = useForm();

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

  const onFinish = (values: IRequestFilter) => {
    const filter = { ...values };

    if (filter.fechas && filter.fechas.length > 1) {
      filter.fechaInicial = filter.fechas[0].utcOffset(0, true);
      filter.fechaFinal = filter.fechas[1].utcOffset(0, true);
    }

    getRequests(filter);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IRequestFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={{ tipoFecha: 1, fechas: [moment(), moment()] }}
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
            <DateRangeInput formProps={{ name: "fechas", label: "Fechas" }} />
          </Col>
          <Col span={8}>
            <TextInput formProps={{ name: "clave", label: "Clave/Paciente" }} />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "procedencias", label: "Procedencia" }}
              multiple
              options={originOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "urgencias", label: "Tipo solicitud" }}
              multiple
              options={urgencyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "estatus", label: "Estatus" }}
              multiple
              options={studyStatusOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "departamentos", label: "Departamento" }}
              multiple
              options={departmentOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "sucursales", label: "Sucursal" }}
              multiple
              options={branchCityOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "compañias", label: "Compañia" }}
              multiple
              options={companyOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ name: "medicos", label: "Médico" }}
              multiple
              options={medicOptions}
            />
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
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

export default observer(RequestFilter);
