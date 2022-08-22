import { Form, Row, Col, Button, Spin } from "antd";
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
  input: (
    | "sucursal"
    | "fecha"
    | "medico"
    | "metodoEnvio"
    | "compañia"
    | "urgencia"
    | "tipoCompañia"
  )[];
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

const urgentOptions: IOptions[] = [
  {
    value: 1,
    label: "Urgencia",
  },
  {
    value: 2,
    label: "Urgencia con cargo",
  },
];

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

const ReportFilter = ({ input, setShowChart }: ReportFilterProps) => {
  const { reportStore, optionStore } = useStore();
  const { currentReport, filter, setFilter, getByFilter, getByChart, clear } =
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

  useEffect(() => {
    form.setFieldsValue(filter);
  }, [clear]) 

  const onFinish = async (filter: IReportFilter) => {
    setLoading(true);
    if (currentReport) {
      await getByFilter(currentReport, filter);
      setFilter(filter);
      if (
        currentReport === "contacto" ||
        currentReport == "estudios" ||
        currentReport == "urgentes" ||
        currentReport == "empresa" ||
        currentReport == "canceladas" ||
        currentReport == "descuento" ||
        currentReport == "cargo" ||
        currentReport == "maquila_interna" ||
        currentReport == "maquila_externa" ||
        currentReport === "medicos-desglosado"
      ) {
        await getByChart(currentReport, filter);
      }
      console.log(filter);
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
                    required={true}
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
              {input.includes("urgencia") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "urgencia", label: "Tipo de Urgencia" }}
                    multiple
                    options={urgentOptions}
                  />
                </Col>
              )}
              {input.includes("tipoCompañia") && (
                <Col span={8}>
                  <SelectInput
                    formProps={{ name: "tipoCompañia", label: "Convenio" }}
                    multiple
                    options={typeCompanyOptions}
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
