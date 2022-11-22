import "./css/changeStatus.less";
import { Button, Col, Collapse, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { IRequestedStudyForm } from "../../app/models/requestedStudy";
import {
  originOptions,
  requestedStudyOptions,
  urgencyOptions,
} from "../../app/stores/optionStore";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import moment from "moment";
const { Panel } = Collapse;

const RequestedStudyFilter = () => {
  const { optionStore, requestedStudyStore } = useStore();
  const { formValues, getAll, setFormValues, clearFilter } =
    requestedStudyStore;
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

  const [form] = useForm();
  const [loading, setLoading] = useState(false);

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

  const onFinish = async (newFormValues: IRequestedStudyForm) => {
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
        <Form<IRequestedStudyForm>
          {...formItemLayout}
          form={form}
          name="requestedStudy"
          onFinish={onFinish}
          initialValues={{
            fecha: [
              moment(Date.now()).utcOffset(0, true),
              moment(Date.now()).utcOffset(0, true).add(1, "day"),
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
                  />
                </Col>
                <Col span={8}>
                  <TextInput
                    formProps={{
                      name: "buscar",
                      label: "Buscar",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <SelectInput
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
                    formProps={{
                      name: "estatus",
                      label: "Estatus",
                    }}
                    multiple
                    options={requestedStudyOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "departamento",
                      label: "Departamento",
                    }}
                    multiple
                    options={departmentAreaOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "medicoId",
                      label: "Médico",
                    }}
                    multiple
                    options={medicOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "sucursalId", label: "Sucursales" }}
                    multiple
                    options={branchCityOptions}
                  />
                </Col>
                <Col span={8}>
                  <SelectInput
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

export default observer(RequestedStudyFilter);
