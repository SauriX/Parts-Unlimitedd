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
import { lte } from "lodash";
import { expandableBudgetStatsConfig } from "../report/columnDefinition/budgetStats";

const IndicatorFilter = () => {
  const { optionStore, indicatorsStore } = useStore();
  const { getByFilter, filter, setFilter } = indicatorsStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
  } = optionStore;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IReportIndicatorsFilter>();

  const selectedCity = Form.useWatch("ciudad", form);
  type pickerType =
    | "time"
    | "date"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [datePickerType, setDatePickerType] = useState<pickerType>("date");

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

  const servicesCosts = () => {
    return IndicatorsModal();
  };

  const onFinish = async (filter: IReportIndicatorsFilter) => {
    let newFilter = { ...filter };
    setLoading(true);

    if (datePickerType === "date") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual).utcOffset(0, true),
        fechaFinal: moment(filter.fechaIndividual).utcOffset(0, true),
      };
    } else if (datePickerType === "week") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual)
          .utcOffset(0, true)
          .startOf("week"),
        fechaFinal: moment(filter.fechaIndividual)
          .utcOffset(0, true)
          .endOf("week"),
      };
    } else if (datePickerType === "month") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual)
          .utcOffset(0, true)
          .startOf("month"),
        fechaFinal:
          moment(filter.fechaIndividual).month() ===
          moment(Date.now()).utcOffset(0, true).month()
            ? moment(Date.now()).utcOffset(0, true)
            : moment(filter.fechaIndividual).utcOffset(0, true).endOf("month"),
      };
    }

    await getByFilter(newFilter);
    setFilter(newFilter);

    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<IReportIndicatorsFilter>
        {...formItemLayout}
        form={form}
        name="indicators"
        initialValues={{
          fechaIndividual: moment(Date.now()).utcOffset(0, true),
        }}
        onFinish={onFinish}
      >
        <Row justify="space-between" gutter={[16, 12]}>
          <Col span={8}>
            <Form.Item label="Fecha" className="no-error-text" help="">
              <Input.Group>
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <DateInput
                      formProps={{
                        label: "",
                        name: "fechaIndividual",
                      }}
                      disableAfterDates
                      pickerType={datePickerType}
                    />
                  </Col>
                  <Col span={12}>
                    <Radio.Group
                      size="small"
                      defaultValue="date"
                      buttonStyle="solid"
                      onChange={(e) => {
                        setDatePickerType(e.target.value);
                      }}
                      value={datePickerType}
                    >
                      <Radio.Button value="date">Dia</Radio.Button>
                      <Radio.Button value="week">Semana</Radio.Button>
                      <Radio.Button value="month">Mensual</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
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
          <Col span={8} className="filter-buttons">
            <Button key="modal" type="text" onClick={() => servicesCosts()}>
              <SettingFilled style={{ fontSize: 14 }} />
            </Button>
            <Button key="filter" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(IndicatorFilter);
