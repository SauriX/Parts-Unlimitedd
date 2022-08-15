import { Button, Col, Collapse, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import form from "antd/lib/form";
import React from "react";
import DateInput from "../../../app/common/form/proposal/DateInput";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { formItemLayout } from "../../../app/util/utils";
import DatosFiscalesForm from "../../proceedings/details/DatosFiscalesForm";
import "./css/index.css";

const { Panel } = Collapse;

const RequestFilter = () => {
  const [form] = useForm();

  return (
    <Collapse ghost className="request-filter-collapse">
      <Panel
        header="Filtros"
        key="filter"
        extra={[
          <Button
            key="clean"
            onClick={(e) => {
              e.preventDefault();
              form.resetFields();
            }}
          >
            Limpiar
          </Button>,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
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
                  label: "Rango de fechas por",
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
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
              <SelectInput formProps={{ name: "procedencia", label: "Procedencia" }} multiple options={[]} />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "tipoSolicitud", label: "Tipo de solicitud" }}
                multiple
                options={[]}
              />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "estatus", label: "Estatus" }} multiple options={[]} />
            </Col>
            <Col span={8}>
              <SelectInput
                formProps={{ name: "departamento", label: "Departamento" }}
                multiple
                options={[]}
              />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "ciudad", label: "Ciudad" }} multiple options={[]} />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "sucursal", label: "Sucursal" }} multiple options={[]} />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "compañia", label: "Compañia" }} multiple options={[]} />
            </Col>
            <Col span={8}>
              <SelectInput formProps={{ name: "medico", label: "Médico" }} multiple options={[]} />
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default RequestFilter;
