import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  TreeSelect,
  Select,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import { useStore } from "../../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import DateRangeInput from "../../../../app/common/form/DateRangeInput";
import moment from "moment";
import {
  IPatientStatisticForm,
  PatientStatisticFormValues,
} from "../../../../app/models/patient_statistic";
import ComponentChart from "../../Component/PatientStatsComponent/ComponentChart";
import ComponentPatientStats from "../../Component/PatientStatsComponent/ComponentPatientStats";

type StatsFormProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  reportName: string;
};

const PatientStatsForm: FC<StatsFormProps> = ({
  componentRef,
  printing,
  reportName,
}) => {
  const { patientStatisticStore, optionStore } = useStore();
  const { statsreport, filtro, setSearch, search } = patientStatisticStore;
  const { BranchCityOptions, getBranchCityOptions } = optionStore;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [sucursal, setSucursal] = useState<string>("");
  const [form] = Form.useForm<IPatientStatisticForm>();
  const { Option, OptGroup } = Select;
  const [loading, setLoading] = useState(false);
  const [Grafica, setGrafica] = useState<boolean>(false);
  const [TablaExp, setTablaExp] = useState<boolean>(true);
  const [Switch, setSwitch] = useState<boolean>(true);

  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IPatientStatisticForm>(
    new PatientStatisticFormValues()
  );

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  const filterBtn = () => {
    form.submit();
  };

  useEffect(() => {
    const readStatsReport = async () => {
      setLoading(true);
      setLoading(false);
    };
    if (readStatsReport.length === 0) {
      readStatsReport();
    }
  }, [statsreport.length]);
  const onFinish = async (newValues: IPatientStatisticForm) => {
    setLoading(true);
    const statsreport = { ...values, ...newValues };
    statsreport.fechaInicial = newValues.fecha[0].toDate();
    statsreport.fechaFinal = newValues.fecha[1].toDate();
    statsreport.fecha = [
      moment(statsreport?.fechaInicial),
      moment(statsreport?.fechaFinal),
    ];
    statsreport.sucursalId = sucursal;
    filtro(statsreport!).then((x) => setLoading(false));
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}></Row>
      <Form<IPatientStatisticForm>
        {...formItemLayout}
        form={form}
        name="report"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row>
          <Col md={10} sm={24} xs={12}>
            <div style={{ marginBottom: "20px" }}>
              <DateRangeInput
                formProps={{ label: "Rango de fechas", name: "fecha" }}
                readonly={readonly}
              />
            </div>
          </Col>
          <Col md={10} sm={24} xs={12}>
            <Form.Item name="CiudadId" label="Ciudad">
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: "left" }}
                treeData={BranchCityOptions}
                placeholder="Please select"
                treeDefaultExpandAll
                value={search.sucursalId}
                onChange={(value) => {
                  setSucursal(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col md={4} sm={24} xs={12}>
            <div style={{ marginLeft: "99px", marginBottom: "20px" }}>
              <Button
                key="new"
                type="primary"
                onClick={() => {
                  filterBtn();
                }}
              >
                Filtrar
              </Button>
            </div>
          </Col>
        </Row>

        <Divider orientation="left"></Divider>
        <Divider orientation="left"></Divider>
        <Row justify="center">
          <Col md={12} sm={24} xs={12}>
            <SwitchInput
              name="Mostrar Gráfica"
              onChange={(value) => {
                if (value) {
                  alerts.info(messages.confirmations.graphic);
                  setGrafica(true);
                  setTablaExp(false);
                } else {
                  alerts.info(messages.confirmations.nographic);
                  setTablaExp(true);
                  setGrafica(false);
                }
                setSwitch(value);
              }}
              label="Gráfica"
              labelAlign="left"
              labelCol={{span: 4}}
              readonly={readonly}
            />
          </Col>
          <Col md={12} sm={24} xs={12}></Col>

          <Col md={12} sm={24} xs={12}>
            {" "}
          </Col>
        </Row>
      </Form>

      <Row>
        <Col md={24} sm={24} xs={24}>
          <div style={{ display: printing ? "" : "none", height: 100 }}></div>
          <div style={{ display: printing ? "none" : "" }}>
            <div ref={componentRef}>
              {printing && (
                <PageHeader
                  ghost={false}
                  title={
                    <HeaderTitle
                      title="Estadística de Pacientes"
                      image="Reportes"
                    />
                  }
                  className="header-container"
                ></PageHeader>
              )}
              {printing && <Divider className="header-divider" />}
              <Col span={24}>
          {TablaExp && (
            <ComponentPatientStats printing={true}></ComponentPatientStats>
          )}
          {Grafica && <ComponentChart printing={true}></ComponentChart>}
        </Col>
            </div>
          </div>
        </Col>
        
      </Row>
    </Spin>
  );
};

export default observer(PatientStatsForm);
