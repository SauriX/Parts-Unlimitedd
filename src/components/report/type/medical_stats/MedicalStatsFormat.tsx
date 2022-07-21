import { Spin, Form, Row, Col, Button, PageHeader, Divider, TreeSelect, Select } from "antd";
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
import { IMedicalStatsForm, MedicalStatsFormValues } from "../../../../app/models/medical_stats";
import ComponentChart from "../../Component/MedicalStatsComponent/ComponentChart";
import ComponentMedicalStats from "../../Component/MedicalStatsComponent/ComponentMedicalStats";

type StatsFormProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  reportName: string;
};

const MedicalStatsFormat: FC<StatsFormProps> = ({ componentRef, printing, reportName }) => {
  return <div></div>;
  // const { medicalStatsStore, optionStore } = useStore();
  // const { statsreport, filtro, setSearch, search } = medicalStatsStore;
  // const {
  //   branchCityOptions: BranchCityOptions,
  //   getBranchCityOptions,
  //   medicOptions: MedicOptions,
  //   getMedicOptions,
  // } = optionStore;
  // const navigate = useNavigate();

  // const [searchParams, setSearchParams] = useSearchParams();
  // const [sucursal, setSucursal] = useState<string>("");
  // const [medic, setMedic] = useState<string>("");
  // const [form] = Form.useForm<IMedicalStatsForm>();
  // const { Option, OptGroup } = Select;
  // const [loading, setLoading] = useState(false);
  // const [Grafica, setGrafica] = useState<boolean>(false);
  // const [TablaExp, setTablaExp] = useState<boolean>(true);
  // const [Switch, setSwitch] = useState<boolean>(true);

  // const [readonly, setReadonly] = useState(
  //   searchParams.get("mode") === "readonly"
  // );
  // const [values, setValues] = useState<IMedicalStatsForm>(
  //   new MedicalStatsFormValues()
  // );

  // useEffect(() => {
  //   getBranchCityOptions();
  // }, [getBranchCityOptions]);

  // useEffect(() => {
  //   getMedicOptions();
  // }, [getMedicOptions]);

  // const filterBtn = () => {
  //   form.submit();
  // };

  // useEffect(() => {
  //   const readStatsReport = async () => {
  //     setLoading(true);
  //     setLoading(false);
  //   };
  //   if (readStatsReport.length === 0) {
  //     readStatsReport();
  //   }
  // }, [statsreport.length]);

  // const onFinish = async (newValues: IMedicalStatsForm) => {
  //   setLoading(true);
  //   const statsreport = { ...values, ...newValues };
  //   statsreport.fechaInicial = newValues.fecha[0].toDate();
  //   statsreport.fechaFinal = newValues.fecha[1].toDate();
  //   statsreport.fecha = [
  //     moment(statsreport?.fechaInicial),
  //     moment(statsreport?.fechaFinal),
  //   ];
  //   const sucursalName = BranchCityOptions.flatMap((x) => x.children).filter(
  //     (x) => statsreport.sucursalId?.includes(x.value)
  //   )?.map(x => x.title).join(", ");
  //   statsreport.sucursal = sucursalName;
  //   if (statsreport.medicoId) {
  //     const medicName = MedicOptions.find(
  //       (x) => x.value === statsreport.medicoId
  //     );
  //     statsreport.nombreMedico = medicName!.label!.toString();
  //   }
  //   filtro(statsreport!).then((x) => setLoading(false));
  //   console.log(newValues);
  // };

  // return (
  //   <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
  //     <Row style={{ marginBottom: 24 }}></Row>
  //     <Form<IMedicalStatsForm>
  //       {...formItemLayout}
  //       form={form}
  //       name="report"
  //       initialValues={values}
  //       onFinish={onFinish}
  //       scrollToFirstError
  //     >
  //       <Row justify="space-between" gutter={8}>
  //         <Col md={8} sm={12} xs={24}>
  //           <DateRangeInput
  //             formProps={{ label: "Rango de fechas", name: "fecha" }}
  //             readonly={readonly}
  //           />
  //         </Col>
  //         <Col md={8} sm={12} xs={24}>
  //           <Form.Item name="sucursalId" label="Ciudad">
  //             <TreeSelect
  //               dropdownStyle={{ maxHeight: 400 }}
  //               treeData={BranchCityOptions}
  //               multiple
  //               placeholder="Seleccione una opción"
  //               treeDefaultExpandAll
  //               // value={search.sucursalId}
  //               // onChange={(value) => {
  //               //   setSucursal(value);
  //               // }}
  //             />
  //           </Form.Item>
  //         </Col>
  //         <Col md={2} sm={12} xs={24}>
  //           <Button
  //             key="new"
  //             type="primary"
  //             onClick={() => {
  //               filterBtn();
  //             }}
  //           >
  //             Filtrar
  //           </Button>
  //         </Col>
  //         <Col md={4} sm={12} xs={24}>
  //           <SwitchInput
  //             name="Mostrar Gráfica"
  //             onChange={(value) => {
  //               if (value) {
  //                 alerts.info(messages.confirmations.graphic);
  //                 setGrafica(true);
  //                 setTablaExp(false);
  //               } else {
  //                 alerts.info(messages.confirmations.nographic);
  //                 setTablaExp(true);
  //                 setGrafica(false);
  //               }
  //               setSwitch(value);
  //             }}
  //             label="Gráfica"
  //             readonly={readonly}
  //           />
  //         </Col>
  //         <Col md={8} sm={12} xs={24}>
  //           <Form.Item name="MedicoId" label="Médico">
  //             <TreeSelect
  //               dropdownStyle={{ maxHeight: 400 }}
  //               treeData={MedicOptions}
  //               placeholder="Seleccione una opción"
  //               treeDefaultExpandAll
  //               // value={search.medicoId}
  //               // onChange={(value) => {
  //               //   setMedic(value);
  //               // }}
  //             />
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //       <Divider orientation="left"></Divider>
  //     </Form>

  //     <Row>
  //       <Col md={24} sm={24} xs={24}>
  //         <div style={{ display: printing ? "" : "none", height: 100 }}></div>
  //         <div style={{ display: printing ? "none" : "" }}>
  //           <div ref={componentRef}>
  //             {printing && (
  //               <PageHeader
  //                 ghost={false}
  //                 title={
  //                   <HeaderTitle
  //                     title="Solicitudes por Médico Condensado"
  //                     image="doctor"
  //                   />
  //                 }
  //                 className="header-container"
  //               ></PageHeader>
  //             )}
  //             {printing && <Divider className="header-divider" />}
  //             <Col span={24}>
  //               {TablaExp && (
  //                 <ComponentMedicalStats
  //                   printing={true}
  //                 ></ComponentMedicalStats>
  //               )}
  //               {Grafica && <ComponentChart printing={true}></ComponentChart>}
  //             </Col>
  //           </div>
  //         </div>
  //       </Col>
  //     </Row>
  //   </Spin>
  // );
};

export default observer(MedicalStatsFormat);
