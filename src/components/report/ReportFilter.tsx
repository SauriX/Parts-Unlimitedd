import { Form, Row, Col, Button, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../app/common/form/SwitchInput";
import { IReportFilter } from "../../app/models/report";
import { IOptions } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";

type ReportFilterProps = {
  input: ("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[];
  setShowChart: React.Dispatch<React.SetStateAction<boolean>>;
};

const sendMethodOptions: IOptions[] = [
  {
    value: 1,
    label: "Correo",
  },
  {
    value: 2,
    label: "Teléfono",
  },
];

const ReportFilter = ({ input, setShowChart }: ReportFilterProps) => {
  const { reportStore, optionStore } = useStore();
  const { currentReport, filter, setFilter, getByFilter } = reportStore;
  const {
    branchCityOptions,
    medicOptions,
    companyOptions,
    getBranchCityOptions,
    getMedicOptions,
    getCompanyOptions,
  } = optionStore;

  const [form] = Form.useForm<IReportFilter>();
  const chartValue = Form.useWatch("grafica", form);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    setShowChart(chartValue);
  }, [chartValue, setShowChart]);

  const onFinish = async (filter: IReportFilter) => {
    setLoading(true);
    if (currentReport) {
      await getByFilter(currentReport, filter);
      setFilter(filter);
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form<IReportFilter>
        {...formItemLayout}
        form={form}
        name="report"
        initialValues={filter}
        onFinish={onFinish}
      >
        <Row justify="space-between" gutter={8}>
          {input.includes("fecha") && (
            <Col md={8} sm={12} xs={24}>
              <DateRangeInput formProps={{ label: "Fecha", name: "fecha" }} />
            </Col>
          )}
          {input.includes("sucursal") && (
            <Col md={8} sm={12} xs={24}>
              <SelectInput
                formProps={{ name: "sucursalId", label: "Sucursales" }}
                multiple
                options={branchCityOptions}
              />
            </Col>
          )}
          {input.includes("medico") && (
            <Col md={8} sm={12} xs={24}>
              <SelectInput
                formProps={{ name: "medicoId", label: "Médico" }}
                multiple
                options={medicOptions}
              />
            </Col>
          )}
          {input.includes("compañia") && (
            <Col md={8} sm={12} xs={24}>
              <SelectInput
                formProps={{ name: "compañiaId", label: "Compañia" }}
                multiple
                options={companyOptions}
              />
            </Col>
          )}
          {input.includes("metodoEnvio") && (
            <Col md={8} sm={12} xs={24}>
              <SelectInput
                formProps={{ name: "metodoEnvio", label: "Método envio" }}
                multiple
                options={sendMethodOptions}
              />
            </Col>
          )}
          <Col md={2} sm={12} xs={24}>
            <Button key="new" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
          <Col md={4} sm={12} xs={24}>
            <SwitchInput name="grafica" label="Mostrar Gráfica" />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(ReportFilter);
