import { Form, Row, Col, Button, Spin, Input } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
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
    | "fechaIndividual"
    | "hora"
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
  const selectedCity = Form.useWatch("ciudad", form);

  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
    getMedicOptions();
    getCompanyOptions();
  }, [getBranchCityOptions, getMedicOptions, getCompanyOptions]);

  useEffect(() => {
    form.setFieldsValue(filter);
  }, [form, filter]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    if (selectedCity != undefined && selectedCity != null) {
      var branhces = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branhces.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
    }
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    setShowChart(chartValue);
    setFilter({ ...filter, grafica: chartValue });
  }, [chartValue, setShowChart]);

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
        currentReport == "presupuestos" ||
        currentReport == "cargo" ||
        currentReport == "maquila_interna" ||
        currentReport == "maquila_externa" ||
        currentReport === "medicos-desglosado"
      ) {
        await getByChart(currentReport, filter);
      }
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="status-container">
        <Form<IReportFilter>
          {...formItemLayout}
          form={form}
          name="report"
          initialValues={{
            fecha: [
              moment(Date.now()).utcOffset(0, true),
              moment(Date.now()).utcOffset(0, true),
            ],
          }}
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
                      disableAfterDates
                    />
                  </Col>
                )}
                {input.includes("sucursal") && (
                  <Col span={8}>
                    <Form.Item
                      label="Sucursal"
                      className="no-error-text"
                      help=""
                    >
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
                              multiple
                              options={cityOptions}
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
                )}
                {input.includes("medico") && (
                  <Col span={8}>
                    <SelectInput
                      form={form}
                      formProps={{ name: "medicoId", label: "Médico" }}
                      multiple
                      options={medicOptions}
                    />
                  </Col>
                )}
                {input.includes("compañia") && (
                  <Col span={8}>
                    <SelectInput
                      form={form}
                      formProps={{ name: "compañiaId", label: "Compañía" }}
                      multiple
                      options={companyOptions}
                    />
                  </Col>
                )}
                {input.includes("metodoEnvio") && (
                  <Col span={8}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "metodoEnvio",
                        label: "Medio de envío",
                      }}
                      multiple
                      options={sendMethodOptions}
                    />
                  </Col>
                )}
                {input.includes("urgencia") && (
                  <Col span={8}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "urgencia",
                        label: "Tipo de Urgencia",
                      }}
                      multiple
                      options={urgentOptions}
                    />
                  </Col>
                )}
                {input.includes("tipoCompañia") && (
                  <Col span={8}>
                    <SelectInput
                      form={form}
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
      </div>
    </Spin>
  );
};

export default observer(ReportFilter);
