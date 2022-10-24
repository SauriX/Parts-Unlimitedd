import { Button, Col, Collapse, Form, Radio, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/TextInput";
import { IMassSearch } from "../../app/models/massResultSearch";
import { IOptions } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";

const { Panel } = Collapse;

const MassSearchForm = () => {
  const [form] = Form.useForm();

  const { optionStore, massResultSearchStore } = useStore();

  const {
    branchCityOptions,
    getBranchCityOptions,
    areas,
    getareaOptions,
    // studyOptions,
    // getStudyOptions,
    studiesOptions,
    getStudiesOptions,
  } = optionStore;

  const { setAreas, getRequestResults } = massResultSearchStore;

  useEffect(() => {
    loadInit();
  }, []);

  const loadInit = async () => {
    await getBranchCityOptions();
    await getareaOptions(0);
    await getStudiesOptions();
  };

  const onFinish = async (values: IMassSearch) => {
    console.log("VALUE", values);
    await getRequestResults(values);
    // setAreas(values.area);
  };

  return (
    <>
      <Collapse ghost className="request-filter-collapse">
        <Panel
          header="Filtros"
          key="1"
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
                form.submit();
                // form.resetFields();
              }}
            >
              Filtrar
            </Button>,
          ]}
        >
          <div className="status-container">
            <Form<IMassSearch>
              {...formItemLayout}
              form={form}
              onFinish={onFinish}
            >
              <Row>
                <Col span={24}>
                  <Row justify="space-between" gutter={[12, 12]}>
                    <Col span={8}>
                      <DateRangeInput
                        formProps={{ label: "Fecha", name: "fechas" }}
                      />
                    </Col>
                    <Col span={8}>
                      <SelectInput
                        formProps={{ label: "Área", name: "area" }}
                        options={areas}
                        onChange={(value: any, option: any) => {
                          console.log("areas", value, option);
                          setAreas(option.label);
                        }}
                      />
                    </Col>
                    <Col span={8}>
                      <TextInput
                        formProps={{ label: "Buscar", name: "busqueda" }}
                      />
                    </Col>
                    <Col span={8}>
                      <SelectInput
                        formProps={{ label: "Sucursal", name: "sucursales" }}
                        multiple
                        options={branchCityOptions}
                      />
                    </Col>
                    <Col span={8}>
                      <SelectInput
                        formProps={{ label: "Estudio", name: "estudios" }}
                        multiple
                        options={studiesOptions}
                      />
                    </Col>
                    <Col span={8} style={{ paddingLeft: "140px" }}>
                      {/* <Radio.Group>
                        <Radio value="unmarked">Desmarcar todos</Radio>
                        <Radio value="marked">Desmarcar todos</Radio>
                      </Radio.Group> */}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};

export default observer(MassSearchForm);
