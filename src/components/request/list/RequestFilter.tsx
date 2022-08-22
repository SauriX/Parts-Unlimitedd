import { Button, Col, Collapse, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import form from "antd/lib/form";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import DateInput from "../../../app/common/form/proposal/DateInput";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { originOptions, studyStatusOptions, urgencyOptions } from "../../../app/stores/optionStore";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
import DatosFiscalesForm from "../../proceedings/details/DatosFiscalesForm";
import "./css/index.css";

const { Panel } = Collapse;

const RequestFilter = () => {
  const { optionStore } = useStore();
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

  const [form] = useForm();

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
    getDepartmentOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions, getDepartmentOptions]);

  return (
    <Collapse ghost className="request-filter-collapse">
      <Panel
        header="Filtros"
        key="filter"
        extra={[
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              form.resetFields();
            }}
          >
            Limpiar
          </Button>,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Filtrar
          </Button>,
        ]}
      >
        <Form<IProceedingForm> {...formItemLayout} form={form} size="small">
          <Row gutter={[0, 12]}>
            <Col span={8}>
              <SelectInput
                formProps={{
                  name: "tipoFiltroFecha",
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
              <TextInput formProps={{ name: "clave", label: "Clave" }} />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "procedencia", label: "Procedencia" }}
                multiple
                options={originOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "tipoSolicitud", label: "Tipo solicitud" }}
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
                formProps={{ name: "departamento", label: "Departamento" }}
                multiple
                options={departmentOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "sucursal", label: "Sucursal" }}
                multiple
                options={branchCityOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "compañia", label: "Compañia" }}
                multiple
                options={companyOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "medico", label: "Médico" }} multiple options={medicOptions} />
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default observer(RequestFilter);
