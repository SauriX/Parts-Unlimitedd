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
import SelectInput from "../../../../app/common/form/SelectInput";
import { IReportForm, ReportFormValues } from "../../../../app/models/report";
import ComponentGraphic from "../../Component/ExpedienteComponents/ComponentGraphic";
import moment from "moment";
import ComponentExpedientes from "../../Component/ExpedienteComponents/ComponentExpedientes";
import { map, zip } from "lodash";
// import { v4 as uuid } from "uuid";

type ReportFormProps = {
  // id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  // handlePrint: () => void;
  // handleDownload: () => Promise<void>;
  reportName: string;
};
const ReportForm: FC<ReportFormProps> = ({
  /*id*/ componentRef,
  printing,
  reportName,
}) => {
  const { reportStore, optionStore } = useStore();
  const { reports, filtro, setSearch, search } = reportStore;
  const { BranchCityOptions, getBranchCityOptions } = optionStore;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [sucursal, setSucursal] = useState<string>("");
  const [form] = Form.useForm<IReportForm>();
  const { Option, OptGroup } = Select;
  const [loading, setLoading] = useState(false);
  const [Grafica, setGrafica] = useState<boolean>(false);
  const [TablaExp, setTablaExp] = useState<boolean>(true);
  const [Switch, setSwitch] = useState<boolean>(true);

  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IReportForm>(new ReportFormValues());

  useEffect(() => {
    getBranchCityOptions();
  }, [
    getBranchCityOptions,
    // console.log(BranchCityOptions, "treeSelect"),
  ]);

  const BtnFiltro = () => {
    form.submit();
  };

  // const SwicthValidator = async () => {
  //   // search.sucursalId = sucursal;
  //   if (Switch) {
  //     console.log("si Grafica");
  //     setGrafica(true);
  //     setTablaExp(false);
  //   } else {
  //     console.log("si Tabla");
  //     setTablaExp(true);
  //     setGrafica(false);
  //   }

  //   // form.submit();
  // };

  useEffect(() => {
    const readReport = async () => {
      setLoading(true);
      // const report = await filtro(search);
      // await filtro(search!);
      setLoading(false);
    };

    if (reports.length === 0) {
      readReport();
    }
  }, [reports.length]);
  const onFinish = async (newValues: IReportForm) => {
    setLoading(true);

    const report = { ...values, ...newValues };
    report.fechaInicial = newValues.fecha[0].toDate();
    report.fechaFinal = newValues.fecha[1].toDate();
    report.fecha = [moment(report?.fechaInicial), moment(report?.fechaFinal)];
    report.sucursalId = sucursal;
    const sucursalName = BranchCityOptions.flatMap(x => x.children).find(x => x.value === report.sucursalId)?.title;
    console.log("Sucursal nombre", sucursalName);
    report.sucursal = sucursalName;
    filtro(report!).then((x) => setLoading(false));
  
    // let success = false;
    // setLoading(false);
    // // await filtro(report);

    // if (success) {
    //   // SwicthValidator();
    // }
  };
  // function disabledDate(current: moment.Moment) {
  //   return current.isBefore(moment(), "day");
  // }
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}></Row>
      <Form<IReportForm>
        {...formItemLayout}
        form={form}
        name="report"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row justify="space-between" gutter={8}>
          <Col md={8} sm={12} xs={24}>
              <DateRangeInput
                formProps={{ label: "Rango de fechas", name: "fecha" }}
                readonly={readonly}
              />
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form.Item name="CiudadId" label="Ciudad">
              <TreeSelect
                dropdownStyle={{ maxHeight: 400 }}
                treeData={BranchCityOptions}
                placeholder="Seleccione una opción"
                treeDefaultExpandAll
                value={search.sucursalId}
                onChange={(value) => {
                  setSucursal(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col md={2} sm={12} xs={24}>
              <Button
                key="new"
                type="primary"
                onClick={() => {
                  BtnFiltro();
                }}
              >
                Filtrar
              </Button>
          </Col>
          <Col md={4} sm={12} xs={24}>
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
              readonly={readonly}
            />
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
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
                    title="Estadística de Expedientes"
                    image="Reportes"
                  />
                }
                className="header-container"
              ></PageHeader>
            )}
            {printing && <Divider className="header-divider" />}
            
        <Col span={24}>
              {TablaExp && (
                <ComponentExpedientes printing={true}></ComponentExpedientes>
              )}
              {Grafica && <ComponentGraphic printing={true}></ComponentGraphic>}
        </Col>
          </div>
        </div>
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(ReportForm);
