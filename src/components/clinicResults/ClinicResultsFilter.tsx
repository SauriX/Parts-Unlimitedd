import { Button, Col, Collapse, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
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

const { Panel } = Collapse;

const ClinicResultsFilter = () => {
  const { optionStore, clinicResultsStore } = useStore();
  const { formValues, getAll, setFormValues, clearFilter } = clinicResultsStore;
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    studiesOptions,
    departmentAreaOptions,
    getDepartmentAreaOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getStudiesOptions,
  } = optionStore;

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [studyFilter, setStudyFilter] = useState<any[]>(studiesOptions);

  useEffect(() => {
    const update = async () => {
      getBranchCityOptions();
      getMedicOptions();
      getCompanyOptions();
      getDepartmentAreaOptions();
      await getStudiesOptions();
      setStudyFilter(studiesOptions);
    };
    update();
  }, [
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
    getDepartmentAreaOptions,
    getStudiesOptions,
  ]);

  const onFinish = async (newFormValues: IClinicResultForm) => {
    setLoading(true);
    const filter = { ...newFormValues };
    setFormValues(newFormValues);
    getAll(filter);
    setLoading(false);
  };

  return (
    <Collapse ghost className="request-filter-collapse">
      <Panel
        key="filter"
        header="Búsqueda"
        extra={[
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              form.resetFields();
              clearFilter();
            }}
          >
            Limpiar
          </Button>,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              form.submit();
            }}
          >
            Buscar
          </Button>,
        ]}
      >
        <div className="status-container">
          <Form<IClinicResultForm>
            {...formItemLayout}
            form={form}
            name="clinicResults"
            onFinish={onFinish}
            initialValues={formValues}
            scrollToFirstError
          >
            <Row>
              <Col span={24}>
                <Row justify="space-between" gutter={[0, 12]}>
                  <Col span={8}>
                    <DateRangeInput
                      formProps={{ label: "Fecha", name: "fecha" }}
                      required={true}
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
                      options={studyStatusOptions}
                    ></SelectInput>
                  </Col>
                  <Col span={8}>
                    <SelectInput
                      formProps={{
                        name: "area",
                        label: "Departamento",
                      }}
                      multiple
                      options={departmentAreaOptions}
                      onChange={(value) => {
                        let filtradoEstudios = studiesOptions.filter(
                          (estudio) => value.includes(+estudio.area)
                        );
                        setStudyFilter(filtradoEstudios);
                        console.log(toJS(studiesOptions));
                        console.log(filtradoEstudios);
                        console.log(value);
                      }}
                    ></SelectInput>
                  </Col>
                  <Col span={8}>
                    <SelectInput
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
      </Panel>
    </Collapse>
  );
};

export default observer(ClinicResultsFilter);
