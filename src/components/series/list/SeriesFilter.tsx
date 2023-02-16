import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { Button, Col, Form, Input, Row, Select, Space, Spin } from "antd";
import { ISeriesFilter } from "../../../app/models/series";
import { formItemLayout } from "../../../app/util/utils";
import moment from "moment";
import DateInput from "../../../app/common/form/proposal/DateInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { seriesTypeOptions } from "../../../app/stores/optionStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const SeriesFilter = () => {
  const { seriesStore, optionStore } = useStore();
  const { getByFilter, setFormValues, setSeriesType, seriesType } = seriesStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;

  const [form] = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions
        .filter((x) => selectedCity?.includes(x.value))
        .flatMap((x) => x.options ?? [])
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const onFinish = async (values: ISeriesFilter) => {
    setLoading(true);
    setFormValues(values);
    await getByFilter(values);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="status-container">
        <Form<ISeriesFilter>
          {...formItemLayout}
          form={form}
          name="series"
          initialValues={{ año: moment(Date.now()).utcOffset(0, true) }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="space-between" gutter={[24, 24]}>
            <Col span={4}>
              <DateInput
                formProps={{
                  label: "Año",
                  name: "año",
                }}
                disableAfterDates
                pickerType="year"
              />
            </Col>
            <Col span={6}>
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
                        options={cityOptions}
                        multiple
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
            <Col span={6}>
              <TextInput
                formProps={{
                  name: "buscar",
                  label: "Buscar",
                }}
                autoFocus
                placeholder="Clave"
              />
            </Col>
            <Col span={4}>
              <SelectInput
                form={form}
                formProps={{
                  name: "tipoSeries",
                  label: "Tipo",
                }}
                multiple
                options={seriesTypeOptions}
              ></SelectInput>
            </Col>
            <Col span={4} style={{textAlign: "right"}}>
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
    </Spin>
  );
};

export default observer(SeriesFilter);
