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
  const { optionStore, indicatorsStore, profileStore } = useStore();
  const { getByFilter, datePickerType, setDatePickerType, setFilter } =
    indicatorsStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { profile } = profileStore;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<IReportIndicatorsFilter>();

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
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      const findCity = branchCityOptions.find((x) =>
        x.options?.some((y) => y.value === profileBranch)
      )?.value;
      if (findCity) {
        form.setFieldValue("ciudad", [findCity]);
      }
      form.setFieldValue("sucursalId", [profileBranch]);
    }
  }, [branchCityOptions, form, profile]);

  const servicesCosts = () => {
    return IndicatorsModal();
  };

  const onFinish = async (filter: IReportIndicatorsFilter) => {
    let newFilter = { ...filter };
    setLoading(true);

    if (datePickerType === "date") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual),
        fechaFinal: moment(filter.fechaIndividual),
        tipoFecha: datePickerType,
      };
    } else if (datePickerType === "week") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual).startOf("week"),
        fechaFinal: moment(filter.fechaIndividual).endOf("week"),
        tipoFecha: datePickerType,
      };
    } else if (datePickerType === "month") {
      newFilter = {
        ...filter,
        fechaInicial: moment(filter.fechaIndividual).startOf("month"),
        fechaFinal:
          moment(filter.fechaIndividual).month() === moment().month()
            ? moment()
            : moment(filter.fechaIndividual).endOf("month"),
        tipoFecha: datePickerType,
      };
    }

    await getByFilter(newFilter);
    setFilter(newFilter);

    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="status-container">
        <Form<IReportIndicatorsFilter>
          {...formItemLayout}
          form={form}
          name="indicators"
          initialValues={{
            fechaIndividual: moment(),
          }}
          onFinish={onFinish}
        >
          <Row justify="space-between" gutter={[16, 12]}>
            <Col span={10}>
              <Form.Item label="Fecha" className="no-error-text" help="">
                <Input.Group>
                  <Row gutter={[16, 12]}>
                    <Col span={10}>
                      <DateInput
                        formProps={{
                          label: "",
                          name: "fechaIndividual",
                        }}
                        disableAfterDates
                        pickerType={datePickerType}
                      />
                    </Col>
                    <Col span={14}>
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
            <Col span={10}>
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
            <Col span={4} className="filter-buttons">
              <Button key="modal" type="text" onClick={() => servicesCosts()}>
                <SettingFilled style={{ fontSize: 14 }} />
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

export default observer(IndicatorFilter);
