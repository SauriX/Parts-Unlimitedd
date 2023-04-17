import { Button, Col, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { IGeneralForm } from "../../app/models/general";
import {
  IMassSearch,
  MassSearchValues,
} from "../../app/models/massResultSearch";
import { IOptions } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";

const AreasFilter = [5, 34, 23, 44, 28, 17, 41, 9, 20];

const MassSearchForm = () => {
  const [form] = Form.useForm();

  const { optionStore, massResultSearchStore, generalStore } = useStore();
  const {
    branchCityOptions,
    getBranchCityOptions,
    areaOptions: areas,
    getAreaOptions: getareaOptions,
    studiesOptions,
    getStudiesOptions,
  } = optionStore;

  const { setAreas, getRequestResults } = massResultSearchStore;
  const { generalFilter, setGeneralFilter } = generalStore;

  const [filteredAreas, setFilteredAreas] = useState<IOptions[]>([]);
  const [studiesFilteredByArea, setStudiesFilteredByArea] = useState<any[]>([]);

  useEffect(() => {
    getRequestResults(generalFilter);
    form.setFieldsValue(generalFilter);
    loadInit();
  }, []);

  useEffect(() => {
    setFilteredAreas(areas.filter((a) => AreasFilter.includes(+a.value)));
  }, [areas]);

  useEffect(() => {
    setStudiesFilteredByArea(studiesOptions);
  }, [studiesOptions]);

  const loadInit = async () => {
    await getareaOptions(0);
    await getStudiesOptions();
  };

  const onFinish = async (values: IGeneralForm) => {
    let nombreArea: string = filteredAreas.find(
      (x) => x.value == values.area![0]
    )?.label as string;
    let putAreaIntoArray: number[] = [];
    putAreaIntoArray.push(+values.area!);

    let newValues = { ...values, nombreArea, area: putAreaIntoArray };
    setGeneralFilter(newValues);
    await getRequestResults(newValues);
  };

  return (
    <div className="status-container">
      <Form<IGeneralForm>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{
          fecha: [moment(), moment()],
        }}
      >
        <Row justify="space-between" gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput
              formProps={{ label: "Fecha", name: "fecha" }}
              disableAfterDates
            />
          </Col>
          <Col span={8}>
            <SelectInput
              formProps={{ label: "Área", name: "area" }}
              options={filteredAreas}
              onChange={(value: any, option: any) => {
                setStudiesFilteredByArea(
                  studiesOptions.filter((s) => s.area === +value)
                );

                setAreas(option.label);
              }}
            />
          </Col>
          <Col span={8}>
            <TextInput formProps={{ label: "Buscar", name: "buscar" }} />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ label: "Sucursal", name: "sucursalId" }}
              multiple
              options={branchCityOptions}
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ label: "Estudio", name: "estudio" }}
              multiple
              options={studiesFilteredByArea}
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

export default observer(MassSearchForm);
