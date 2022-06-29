import {
    Spin,
    Form,
    Row,
    Col,
    Button,
    PageHeader,
    Divider,
  } from "antd";
  import React, { FC, useEffect, useState } from "react";
  import { formItemLayout } from "../../../../app/util/utils";
  import SwitchInput from "../../../../app/common/form/SwitchInput";
  import { useStore } from "../../../../app/stores/store";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import ImageButton from "../../../../app/common/button/ImageButton";
  import HeaderTitle from "../../../../app/common/header/HeaderTitle";
  import { observer } from "mobx-react-lite";
  import alerts from "../../../../app/util/alerts";
  import messages from "../../../../app/util/messages";
  import DateRangeInput from "../../../../app/common/form/DateRangeInput";
  import SelectInput from "../../../../app/common/form/SelectInput";
import { IReportForm, ReportFormValues } from "../../../../app/models/report";
  
  type PruebaFormProps = {
    // id: string;
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
    // handlePrint: () => void;
    // handleDownload: () => Promise<void>;
    reportName: string;
  };
  const PruebaForm: FC<PruebaFormProps> = ({ /*id*/ componentRef, printing, reportName }) => {
    const { optionStore } = useStore();
    const {BranchOptions,getBranchOptions,MedicOptions, getMedicOptions,CompanyOptions,getCompanyOptions} = optionStore;
  
    const [searchParams] = useSearchParams();
  
    const [form] = Form.useForm<IReportForm >();
  
    const [loading, setLoading] = useState(false);
    const [readonly] = useState(
      searchParams.get("mode") === "readonly"
    );
    const [values] = useState<IReportForm>(new ReportFormValues());
  
  
    useEffect(() => {
      getBranchOptions();
      getMedicOptions();
      getCompanyOptions();
    }, [
      getBranchOptions,
      getMedicOptions,
      getCompanyOptions,
    ]);

  
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
                <Col md={12} sm={24} xs={12}>
                
                  </Col>
                  <Col md={12} sm={24} xs={12}></Col>
                  <Col md={12} sm={24} xs={12}> 
                   <div style={{ marginBottom: "20px" }}>
                    <DateRangeInput
                      formProps={{ label: "Rango de fechas", name: "fecha" }}
                      readonly={readonly}
                    />
                  </div>
                  </Col>
                  <Col md={12} sm={24} xs={12}></Col>
                  <Col md={12} sm={24} xs={12}>
                    
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
                  <Col md={12} sm={24} xs={12}> 
                  <SelectInput
                    formProps={{
                      name: "sucursal",
                      label: "Sucursal",
                    }}
                    readonly={readonly}
                    options={BranchOptions}
                  />
                  </Col>
                  <Col md={12} sm={24} xs={12}></Col>
                  <Col md={12} sm={24} xs={12}> 
                  <SelectInput
                    formProps={{
                      name: "compañia",
                      label: "Compañia",
                    }}
                    readonly={readonly}
                    options={CompanyOptions}
                  />
                  </Col>
                  <Col md={12} sm={24} xs={12}></Col>
                  <Col md={12} sm={24} xs={12}> 
                  <SelectInput
                    formProps={{
                      name: "medico",
                      label: "Medicos",
                    }}
                    readonly={readonly}
                    options={MedicOptions}
                  />
                 
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
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
          </div>
        </div>
        </Row>
      </Spin>
    );
  };
  
  export default observer(PruebaForm);


  