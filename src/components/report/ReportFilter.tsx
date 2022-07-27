import { Form, Row, Col, Button, Spin } from "antd";
import { graphic } from "echarts";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../app/common/form/proposal/SwitchInput";
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
    label: "WhatsApp",
  },
];

const ReportFilter = ({ input, setShowChart }: ReportFilterProps) => {
  const { reportStore, optionStore } = useStore();
  const { currentReport, filter, setFilter, getByFilter, getByChart } =
    reportStore;
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
    setFilter({ ...filter, grafica: chartValue });
  }, [chartValue, setShowChart]);

  const onFinish = async (filter: IReportFilter) => {
    setLoading(true);
    if (currentReport) {
      await getByFilter(currentReport, filter);
      setFilter(filter);
      if (currentReport === "contacto" || currentReport == "estudios") {
        await getByChart(currentReport, filter);
      }
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
        <Row>
          <Col span={22}>
            <Row justify="space-between" gutter={[12, 12]}>
              {input.includes("fecha") && (
                <Col span={8}>
                  <DateRangeInput
                    formProps={{ label: "Fecha", name: "fecha" }}
                  />
                </Col>
              )}
              {input.includes("sucursal") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "sucursalId", label: "Sucursales" }}
                    multiple
                    options={branchCityOptions}
                  />
                </Col>
              )}
              {input.includes("medico") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "medicoId", label: "Médico" }}
                    multiple
                    options={medicOptions}
                  />
                </Col>
              )}
              {input.includes("compañia") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "compañiaId", label: "Compañía" }}
                    multiple
                    options={companyOptions}
                  />
                </Col>
              )}
              {input.includes("metodoEnvio") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "metodoEnvio", label: "Medio de envío" }}
                    multiple
                    options={sendMethodOptions}
                  />
                </Col>
              )}
              <Col span={8}>
                <SwitchInput name="grafica" label="Gráfica" />
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

export default observer(ReportFilter);
