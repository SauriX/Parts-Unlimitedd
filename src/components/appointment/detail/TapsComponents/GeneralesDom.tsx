import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber, Tabs, Descriptions } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../../app/models/shared";
import moment from "moment";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IQuotationGeneralesForm, QuotationGeneralesFormValues } from "../../../../app/models/quotation";
import TextArea from "antd/lib/input/TextArea";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
type GeneralesFormProps = {
    printing: boolean;
    generales: React.Dispatch<React.SetStateAction<IQuotationGeneralesForm | undefined>>;
    handle: boolean,
    data: IQuotationGeneralesForm | undefined
  };


const GeneralesDomForm:FC<GeneralesFormProps> = ({  printing,generales,data })=>{
    const {optionStore}=useStore();
    const { getMedicOptions,getCompanyOptions,MedicOptions,CompanyOptions } = optionStore;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<IQuotationGeneralesForm>();
    const [values, setValues] = useState<IQuotationGeneralesForm>(new QuotationGeneralesFormValues());
    const [errors, setErrors] = useState<IFormError[]>([]);
    const [type,SetType]=useState("");
    useEffect(()=>{
        form.setFieldsValue(data!);
    },[data])
    useEffect(()=>{
        const readMedics = async ()=>{
            await getMedicOptions();
        }
        readMedics();
    },[getMedicOptions]);
    useEffect(()=>{
        const readCompany = async ()=>{
            await getCompanyOptions();
        }
        readCompany();
    },[getCompanyOptions]);

    useEffect(()=>{
        form.submit();
    },[generales])
    const onFinish = async (newValues: IQuotationGeneralesForm) => {
        const reagent = { ...values, ...newValues };
        console.log("onfinish");
        console.log(reagent);
        generales(reagent);
        /*     setLoading(true);
        
            const reagent = { ...values, ...newValues };
        
              
              let success = false;
              reagent.taxData = tax;
              if (!reagent.id) {
                 success = await create(reagent);      
              } else{
                success = await update(reagent);
              }
              setLoading(false);
              if (success) {
        
                goBack();
                
              }   */
        
    };
    
    const onValuesChange = async (changedValues: IQuotationGeneralesForm) => {
        const field = Object.keys(changedValues)[0];
        form.submit();
        if(field=="edad"){
         /*  const edad = changedValues[field] as number; */
          var hoy = new Date();
      /*     var cumpleaños =  hoy.getFullYear()-edad; */
          /* hoy.setFullYear(cumpleaños); */
          /* setValues((prev) => ({ ...prev, fechaNacimiento: hoy })) */
        }
        if (field === "cp") {
          /* const zipCode = changedValues[field] as string */;
    
  /*         if (zipCode && zipCode.trim().length === 5) {
            } */

        }
    };
    return(
        <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
            <Form<IQuotationGeneralesForm>
                {...formItemLayout}
                form={form} 
                name="generales"
                initialValues={values}
                onFinish={onFinish}
                scrollToFirstError
                onValuesChange={onValuesChange}
                onFinishFailed={({ errorFields }) => {
                    const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
                    setErrors(errors);
                  }}
            >
                <Row gutter={[0, 12]}>
                    <Col sm={12}> 
                        <SelectInput
                            formProps={{
                                name: "procedencia",
                                label: "Recolección",
                            }}
                            errors={errors.find((x) => x.name === "nombre")?.errors}
                            options={[{value:"compañia",label:"Compañia"},{value:"particular",label:"Particular"}]}
                        ></SelectInput>
                    </Col>  
                    <Col sm={12}></Col>
                    <Col span={12}>
                    <TextInput
                            formProps={{
                                name: "compañia",
                                label: "Dirección",
                            }}
                          required  
                    ></TextInput>
                    </Col>
                    <Col sm={12}></Col>
                    <Col span={12}>
                    <TextInput
                            formProps={{
                                name: "compañia",
                                label: "Celular",
                            }}
                            
                    ></TextInput>
                    </Col>
                    <Col sm={12}></Col>
                    <Col sm={12}></Col>
                    <Col span={14}>
                    <TextAreaInput
                        formProps={{
                        name: "observaciones",
                        label: "Observaciones",
                        labelCol: { span: 24 },
                        wrapperCol: { span: 24 },
                        }}
                        rows={3}
                        errors={errors.find((x) => x.name === "observaciones")?.errors}
                    />
                    </Col>
                    <Col sm={10}>
                    </Col>
                    <Col sm={12}>
                        <label style={{marginLeft:"100px",marginTop:"20px"}} htmlFor="">Enviar por: </label>
                        <Checkbox checked={type=="Email"||type=="Ambos"} onChange={(values)=>{values.target.checked?SetType("Email"):SetType("")}} style={{marginLeft:"10px",marginTop:"20px"}}>Email</Checkbox>
                        <Checkbox checked={type=="Whatsapp" ||  type=="Ambos"} onChange={(values)=>{values.target.checked?SetType("Whatsapp"):SetType("")}} style={{marginLeft:"10px",marginTop:"20px"}}>Whatsapp</Checkbox>
                        <Checkbox checked={type=="Ambos"} onChange={(values)=>{values.target.checked?SetType("Ambos"):SetType("")}} style={{marginLeft:"10px",marginTop:"20px"}}>Ambos</Checkbox>
                    </Col>
                    <Col sm={12}>
                    <SwitchInput style={{marginLeft:"100px",marginTop:"10px"}}
                            name="activo"
                            label="Activo"
                            onChange={(value) => {
                            if (value) {
                                alerts.info(messages.confirmations.enable);
                            } else {
                                alerts.info(messages.confirmations.disable);
                            }
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <TextInput
                            formProps={{
                            name: "email",
                            label: "E-mail",
                            }}
                            max={100}
                            showLabel
                            errors={errors.find((x) => x.name === "nombre")?.errors}
                            readonly={type!="Email" && type != "Ambos"}
                        />
                    </Col>
                    <Col span={3}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            /* form.submit(); */
                        }}
                        >
                        Prueba Envio
                    </Button>
                    </Col>
                    <Col span={9}></Col>
                    <Col span={12}>
                        <TextInput
                            formProps={{
                            name: "whatssap",
                            label: "Whatsapp",
                            }}
                            max={100}
                            showLabel
                            readonly={type!="Whatsapp" && type != "Ambos"}
                            errors={errors.find((x) => x.name === "nombre")?.errors}
                        />
                    </Col>
                    <Col span={3}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            /* form.submit(); */
                        }}
                        >
                        Prueba Envio
                    </Button>
                    </Col>
                    <Col span={9}></Col>
                </Row>
            </Form>
        </Spin>
    )
};

export default observer(GeneralesDomForm);

