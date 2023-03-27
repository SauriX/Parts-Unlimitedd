import { Form, Row, Col, Button, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateInput from "../../app/common/form/proposal/DateInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../app/common/form/proposal/SwitchInput";
import TimeRangeInput from "../../app/common/form/proposal/TimeRangeInput";
import { ICashRegisterFilter } from "../../app/models/cashRegister";
import { IOptions } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";

const typeCompanyOptions: IOptions[] = [
  {
    value: 1,
    label: "Convenio",
  },
  {
    value: 2,
    label: "Todas",
  },
];

const CashRegisterFilter = () => {
  const { cashRegisterStore, optionStore, profileStore } = useStore();
  const {
    filter,
    setFilter,
    getByFilter,
    clear,
    setShowChart: setActiveChart,
  } = cashRegisterStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;
  const { profile } = profileStore;

  const [form] = Form.useForm<ICashRegisterFilter>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    form.setFieldsValue(filter);
  }, [filter, form]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      form.setFieldValue("sucursalId", [profileBranch]);
    }
  }, [branchCityOptions, form, profile]);

  const onFinish = async (filter: ICashRegisterFilter) => {
    setLoading(true);
    await getByFilter(filter);
    setFilter(filter);
    setLoading(false);
  };

  const onChangeChart = (value: boolean) => {
    setActiveChart(value);
  };

  return (
    <Spin spinning={loading}>
      <div className="status-container">
        <Form<ICashRegisterFilter>
          {...formItemLayout}
          form={form}
          name="cash"
          initialValues={filter}
          onFinish={onFinish}
        >
          <Row justify="space-between" gutter={[12, 12]}>
            <Col span={8}>
              <DateInput
                formProps={{ label: "Fecha", name: "fechaIndividual" }}
                required={true}
              />
            </Col>
            <Col span={8}>
              <TimeRangeInput
                formProps={{ label: "Hora", name: "hora" }}
                required={true}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                form={form}
                formProps={{ name: "sucursalId", label: "Sucursales" }}
                multiple
                options={branchCityOptions}
              />
            </Col>
            <Col span={8}>
              <SelectInput
                form={form}
                formProps={{ name: "tipoCompañia", label: "Convenio" }}
                multiple
                options={typeCompanyOptions}
              />
            </Col>
            <Col span={8}>
              <SwitchInput onChange={onChangeChart} />
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Button key="new" type="primary" htmlType="submit">
                Mostrar listado
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Spin>
  );
};

export default observer(CashRegisterFilter);
