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
    const {reports, filtro, setSearch,search } = reportStore;
    const {
      BranchCityOptions, getBranchCityOptions} = optionStore;
    const navigate = useNavigate();
  
  
    const [searchParams, setSearchParams] = useSearchParams();
  
    const [form] = Form.useForm<IReportForm >();
    const { Option, OptGroup } = Select;
    const [loading, setLoading] = useState(false);
    const [Grafica, setGrafica] = useState<boolean>(false);
    const [TablaExp, setTablaExp] = useState<boolean>(true);
    const [Switch, setSwitch] = useState<boolean>(false) ;
      
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
  
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };

    const SwicthValidator= async ()=> {
      if(Switch){
        console.log("si entree")
        setGrafica(true);
        setTablaExp(false);
      }else{
        setTablaExp(true);
        setGrafica(false);
          }
          await filtro(search!);
      }
      useEffect(() => {
        const readReport = async () => {
          setLoading(true);
          await filtro(search!);
          setLoading(false);
        };
    
        if (reports.length === 0) {
          readReport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    const onFinish = async (newValues: IReportForm) => {
      setLoading(true);
  
      const report = { ...values, ...newValues };
      report.fechaInicial = newValues.fecha[0].toDate();
      report.fechaFinal = newValues.fecha[1].toDate();
  
  
      let success = false;
  
      setLoading(false); 
      // success = await filtro(report);

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
              
                  <Col md={10} sm={24} xs={12}> 
                   <div style={{ marginBottom: "20px" }}>
                    <DateRangeInput
                      formProps={{ label: "Rango de fechas", name: "fecha" }}
                      readonly={readonly}
                      
                    />
                  </div>
                  </Col>
                  <Col md={14} sm={24} xs={12}> 
                  <Form.Item name="ciudadId" label="Ciudad">
                  <TreeSelect
                    // style={{ width: "80%" }}
                    // value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: "left" }}
                    treeData={BranchCityOptions}
                    placeholder="Please select"
                    treeDefaultExpandAll
                    value={search.sucursalId} 
                    onChange={(value)=>{
                      setSearch({ ...search,sucursalId:value  })
                    }} 
                  />
                </Form.Item>
                  </Col>
                  {/* <Col md={8} sm={24} xs={12}>
                    
                  <SelectInput
                    formProps={{
                      name: "sucursalId",
                      label: "Sucursal",
                    }}
                    readonly={readonly}
                    options={CityOptions}
                  />
                  </Col> */}
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
                    setSwitch(value)
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
                  SwicthValidator();
                  }}
                >
                Aceptar
                </Button>
                </Col>
                
                  <Col md={12} sm={24} xs={12}> </Col>
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
                  <HeaderTitle title="Expedientes" image="Reportes" />
                }
                className="header-container"
              ></PageHeader>
            )}
            {printing && <Divider className="header-divider" />} 
            <Row justify="center">
            {TablaExp && <ComponentExpedientes></ComponentExpedientes>}  
            {Grafica && <ComponentGraphic></ComponentGraphic> }
            </Row>
          </div>
        </div>
        </Row>
      </Spin>
    );
  };
  
  export default observer(ReportForm);


  