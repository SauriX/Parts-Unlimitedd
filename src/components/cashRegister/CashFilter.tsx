import { Form, Row, Col, Button, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateInput from "../../app/common/form/proposal/DateInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
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
  const { cashRegisterStore, optionStore } = useStore();
  const {
    filter,
    setFilter,
    getByFilter,
    clear,
  } = cashRegisterStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;

  const [form] = Form.useForm<ICashRegisterFilter>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    form.setFieldsValue(filter);
  }, [clear]);

  const onFinish = async (filter: ICashRegisterFilter) => {
    setLoading(true);
    await getByFilter(filter);
    setFilter(filter);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<ICashRegisterFilter>
        {...formItemLayout}
        form={form}
        name="cash"
        initialValues={filter}
        onFinish={onFinish}
      >
        <Row>
          <Col span={22}>
            <Row justify="space-between" gutter={[12, 12]}>
              <Col span={8}>
                <DateInput
                  formProps={{ label: "Fecha", name: "fecha" }}
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
                  formProps={{ name: "sucursalId", label: "Sucursales" }}
                  multiple
                  options={branchCityOptions}
                />
              </Col>
              <Col span={8}>
                <SelectInput
                  formProps={{ name: "tipoCompañia", label: "Convenio" }}
                  multiple
                  options={typeCompanyOptions}
                />
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

export default observer(CashRegisterFilter);
