import { Button, Col, Form, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import DateInput from "../../app/common/form/proposal/DateInput";
import TimeRangeInput from "../../app/common/form/proposal/TimeRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import { IWorkListFilter } from "../../app/models/workList";

const WorkListFilter = () => {
  const { workListStore, optionStore } = useStore();
  const {
    departmentAreaOptions,
    branchCityOptions,
    getDepartmentAreaOptions,
    getBranchCityOptions,
  } = optionStore;
  const { filter, setFilter } = workListStore;

  const [form] = useForm<IWorkListFilter>();

  useEffect(() => {
    getDepartmentAreaOptions();
    getBranchCityOptions();
  }, [getBranchCityOptions, getDepartmentAreaOptions]);

  const onFinish = (values: IWorkListFilter) => {
    const filter = { ...values };
    filter.horaInicio = filter.hora[0].utcOffset(0, true);
    filter.horaFin = filter.hora[1].utcOffset(0, true);
    filter.area = departmentAreaOptions
      .flatMap((x) => x.options)
      .find((x) => x?.value === values.areaId)
      ?.label?.toString();
    setFilter(filter);
  };

  return (
    <div className="status-container">
      <Form<IWorkListFilter>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={filter}
        size="small"
      >
        <Row gutter={[0, 12]}>
          <Col span={5}>
            <SelectInput
              formProps={{
                name: "areaId",
                label: "Lista de trabajo",
              }}
              options={departmentAreaOptions}
              required
            />
          </Col>
          <Col span={9}>
            <SelectInput
              formProps={{
                name: "sucursales",
                label: "Sucursales",
                labelCol: { span: 5 },
                wrapperCol: { span: 19 },
              }}
              options={branchCityOptions}
              required
              multiple
            />
          </Col>
          <Col span={3}>
            <DateInput formProps={{ name: "fecha", label: "Fecha" }} required />
          </Col>
          <Col span={3}>
            <TimeRangeInput
              formProps={{ name: "hora", label: "Hora" }}
              required
            />
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Button
              key="filter"
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Mostrar Listado
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(WorkListFilter);
