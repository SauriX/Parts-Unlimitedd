import { Row, Col, Button, Form, Input, Spin, Radio } from "antd";
import { useEffect, useState } from "react";
import DateInput from "../../app/common/form/proposal/DateInput";
import TimeRangeInput from "../../app/common/form/proposal/TimeRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { useStore } from "../../app/stores/store";
import { IOptions } from "../../app/models/shared";
import { IReportIndicatorsFilter } from "../../app/models/indicators";
import { formItemLayout } from "../../app/util/utils";
import { SettingFilled } from "@ant-design/icons";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { IndicatorsModal } from "./modal/IndicatorsModal";

type IndicatorProps = {
  pickerType:
    | "time"
    | "date"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
};

const IndicatorFilter = ({ pickerType }: IndicatorProps) => {
  const { optionStore, indicatorsStore } = useStore();
  const { getByFilter, filter, setFilter } = indicatorsStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IReportIndicatorsFilter>();

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [datePickerType, setDatePickerType] = useState(pickerType);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  const servicesCosts = () => {
    return IndicatorsModal();
  };

  const onFinish = async (filter: IReportIndicatorsFilter) => {
    setLoading(true);

    if (datePickerType === "week") {
      const newFilter: IReportIndicatorsFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual).startOf("week"),
        fechaFinal: moment(filter.fechaIndividual).endOf("week"),
      };
      await getByFilter(newFilter);
      setFilter(newFilter);
    } else if (datePickerType === "month") {
      const newFilter: IReportIndicatorsFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual).startOf("month"),
        fechaFinal:
          moment(filter.fechaIndividual).month() === moment(Date.now()).month()
            ? moment(Date.now()).utcOffset(0, true)
            : moment(filter.fechaIndividual).endOf("month"),
      };
      await getByFilter(newFilter);
      setFilter(newFilter);
    } else {
      await getByFilter(filter);
      setFilter(filter);
    }

    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<IReportIndicatorsFilter>
        {...formItemLayout}
        form={form}
        name="indicators"
        initialValues={{
          fechaInvidual: 
            moment(Date.now()).utcOffset(0, true)
        }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={22}>
            <Row justify="space-between" gutter={[12, 12]}>
              <Col span={8}>
                <Radio.Group
                  size="small"
                  defaultValue="date"
                  onChange={(e) => {
                    setDatePickerType(e.target.value);
                  }}
                  value={pickerType}
                >
                  <Radio.Button value="date">Dia</Radio.Button>
                  <Radio.Button value="week">Semana</Radio.Button>
                  <Radio.Button value="month">Semana</Radio.Button>
                </Radio.Group>
                <DateInput
                  formProps={{ label: "Fecha", name: "fecha" }}
                  pickerType={datePickerType}
                />
              </Col>
              <Col span={8}>
                <TimeRangeInput
                  formProps={{ label: "Hora", name: "hora" }}
                  required={true}
                />
              </Col>
              <Col span={8}>
                <Form.Item label="Sucursal" className="no-error-text" help="">
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <SelectInput
                          formProps={{
                            name: "ciudad",
                            label: "Ciudad",
                            noStyle: true,
                          }}
                          options={cityOptions}
                        />
                      </Col>
                      <Col span={12}>
                        <SelectInput
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
                <SettingFilled onClick={() => servicesCosts()} />
              </Col>
            </Row>
          </Col>
          <Col span={2} style={{ textAlign: "right" }}>
            <Button key="new" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(IndicatorFilter);
