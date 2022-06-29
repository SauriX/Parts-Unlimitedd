import {
    Spin,
    Form,
    Row,
    Col,
    Pagination,
    Button,
    PageHeader,
    DatePicker,
    Divider,
    Radio,
    TreeSelect,
    Select,
  } from "antd";
  import React, { FC, useEffect, useState } from "react";
  import { formItemLayout } from "../../../../app/util/utils";
  import { PlusOutlined } from "@ant-design/icons";
  import TextInput from "../../../../app/common/form/TextInput";
  import SwitchInput from "../../../../app/common/form/SwitchInput";
  import { useStore } from "../../../../app/stores/store";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import ImageButton from "../../../../app/common/button/ImageButton";
  import HeaderTitle from "../../../../app/common/header/HeaderTitle";
  import { observer } from "mobx-react-lite";
  import alerts from "../../../../app/util/alerts";
  import messages from "../../../../app/util/messages";
  import moment from "moment";
  import DateRangeInput from "../../../../app/common/form/DateRangeInput";
  import SelectInput from "../../../../app/common/form/SelectInput";
import { IReportForm, ReportFormValues } from "../../../../app/models/report";
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ComponentExpedientes from "../../Component/ComponentExpedientes";
import ComponentGraphic from "../../Component/ComponentGraphic";
  // import { v4 as uuid } from "uuid";
  
  type ReportFormProps = {
    // id: string;
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
    // handlePrint: () => void;
    // handleDownload: () => Promise<void>;
    reportName: string;
  };
  const ReportForm: FC<ReportFormProps> = ({ /*id*/ componentRef, printing, reportName}) => {
    const { reportStore, optionStore } = useStore();
    const {reports } = reportStore;
    const {BranchOptions,getBranchOptions,
      BranchCityOptions, getBranchCityOptions,
      CompanyOptions,getCompanyOptions,
      CityOptions, getCityOptions} = optionStore;
    const navigate = useNavigate();
  
  
    const [searchParams, setSearchParams] = useSearchParams();
  
    const [form] = Form.useForm<IReportForm >();
    const { Option, OptGroup } = Select;
    const [loading, setLoading] = useState(false);
    const [readonly, setReadonly] = useState(
      searchParams.get("mode") === "readonly"
    );
    const [values, setValues] = useState<IReportForm>(new ReportFormValues());
  
  
    useEffect(() => {
      getBranchOptions();
      getBranchCityOptions();
      getCompanyOptions();
      getCityOptions();
    }, [
      getBranchOptions,
      getBranchCityOptions,
      getCompanyOptions,
      getCityOptions,
    ]);

    const treeData = [
      {
        title: "Nuevo Léon",
        value: "sucursalDestinoId",
        children: BranchOptions.map((x ) => ({
          title: x.label,
          value: x.value,
        })),
      },
      // {
      //   title: "Jalisco",
      //   value: "maquiladorId",
      //   children: CityOptions.map((x) => ({
      //     title: x.label,
      //     value: x.value,
      //   })),
      // },
      // {
      //   title: "Sinaloa",
      //   value: "maquiladorId",
      //   children: CompanyOptions.map((x) => ({
      //     title: x.label,
      //     value: x.value,
      //   })),
      // },
    ];
  
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };

    const onFinish = async (newValues: IReportForm) => {
      setLoading(true);
  
      const report = { ...values, ...newValues };
      report.fechaInicial = newValues.fecha[0].toDate();
      report.fechaFinal = newValues.fecha[1].toDate();
  
  
      let success = false;
  
      setLoading(false); 
  
      if (success) {
        // goBack();
      }
    };
  
 
    return (
      <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
        <Row style={{ marginBottom: 24 }}>

        </Row>
        <Form<IReportForm>
              {...formItemLayout}
              form={form}
              name="report"
              initialValues={values}
              onFinish={onFinish}
              scrollToFirstError
            >
              <Row>
              
                  <Col md={8} sm={24} xs={12}> 
                   <div style={{ marginBottom: "20px" }}>
                    <DateRangeInput
                      formProps={{ label: "Rango de fechas", name: "fecha" }}
                      readonly={readonly}
                    />
                  </div>
                  </Col>
                  <Col md={8} sm={24} xs={12}> 
                  <Form.Item name="ciudadId" label="Ciudad">
                  <TreeSelect
                    // style={{ width: "80%" }}
                    // value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    treeData={treeData}
                    placeholder="Please select"
                    treeDefaultExpandAll
                    // defaultValue={}
                    onSelect={(value: any, node: any) => {
                      console.log(value);
                      console.log(node);

                      const parent = treeData.find((x) =>
                        x.children.map((x) => x.value).includes(value)
                      );
                      console.log(parent);
                    }}
                  />
                </Form.Item>
                  </Col>
                  <Col md={8} sm={24} xs={12}>
                    
                  <SelectInput
                    formProps={{
                      name: "sucursalId",
                      label: "Sucursal",
                    }}
                    readonly={readonly}
                    options={CityOptions}
                  />
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
                    } else {
                      alerts.info(messages.confirmations.nographic);
                    }
                  }}
                  label="Gráfica"
                  readonly={readonly}
                />
                </Col>
                  <Col md={12} sm={24} xs={12}> 
                <Button
                key="new"
                type="primary"
                onClick={() => {
                  // navigate(`/${views.reagent}/new?${searchParams}&mode=edit`);
                  }}
                >
                Aceptar
                </Button>
                </Col>
                
              </Row>
            </Form>
            
            <Row>
            
        <div style={{ display: printing ? "" : "none", height: 300 }}></div>
        <div style={{ display: printing ? "none" : "" }}>
          <div ref={componentRef}>
            {printing && (
              <PageHeader
                ghost={false}
                title={
                  <HeaderTitle title="Expedientes" image="Lealtad" />
                }
                className="header-container"
              ></PageHeader>
            )}
            {printing && <Divider className="header-divider" />}   
            {/* <ComponentExpedientes componentRef={undefined} printing={false}></ComponentExpedientes>   
            <ComponentGraphic componentRef={undefined} printing={false}></ComponentGraphic>   */}
          </div>
        </div>
        </Row>
      </Spin>
    );
  };
  
  export default observer(ReportForm);


  