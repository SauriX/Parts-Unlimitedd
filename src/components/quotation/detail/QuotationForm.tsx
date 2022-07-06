import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber, Tabs, Descriptions } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import NumberInput from "../../../app/common/form/proposal/MaskInput";
import DateInput from "../../../app/common/form/proposal/DateInput";
import SelectInput from "../../../app/common/form/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../app/models/shared";
import moment from "moment";
import  GeneralesForm  from "./TapsComponents/Generales"
import ExpedientesForm from "./TapsComponents/Estudios"
import IndiciacionesForm from "./TapsComponents/Indicaciones"
import BusquedaForm from "./TapsComponents/Busqueda"
import { IQuotationForm, IQuotationGeneralesForm, IQuotationPrice, QuotationFormValues } from "../../../app/models/quotation";
import { IProceedingList } from "../../../app/models/Proceeding";
import { IRequestPrice } from "../../../app/models/request";
import { sum } from "lodash";
type QuotationFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const QuotationForm: FC<QuotationFormProps> = ({ id, componentRef, printing }) => {
  const navigate = useNavigate();
  const { modalStore,  locationStore, optionStore,profileStore,quotationStore,priceListStore } = useStore();
   const { getById, update,  create,  search,  } = quotationStore;
 const [data, setData] = useState<IRequestPrice[]>([]);
  const { profile } = profileStore;
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [form] = Form.useForm<IQuotationForm>();
  const [values, setValues] = useState<IQuotationForm>(new QuotationFormValues());
  const { getColoniesByZipCode } = locationStore;
  const { openModal,closeModal } = modalStore;
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [date, setDate] = useState(moment(new Date(moment.now())));
  const [continuar, SetContinuar] = useState<boolean>(true);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const[generales,setGenerales] = useState<IQuotationGeneralesForm>();
  const [generalesSumbit,setGeneralesSumbit] = useState(false);
  const [record,Setrecord]=useState<IProceedingList>();
  const [total,SetTotal]=useState<number>();
  const { TabPane } = Tabs;
  const goBack = () => {
    
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.proceeding}?${searchParams}`);
    closeModal();
  };

  useEffect(()=>{

    console.log(values,"values");
    form.setFieldsValue(values!);
  },[values]);



/*   const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  }; */


  useEffect(() => {
    const readExpedinte = async (id: string) => {
      setLoading(true);
      var  expediente = await getById(id);

      var suma = 0;
      expediente!.estudy!.forEach ((x)=>{
  
          suma += x.precioFinal;
      });

      SetTotal(suma);
      setGenerales(expediente?.generales);
      console.log(expediente,"expediente");
      form.setFieldsValue(expediente!);
      setValues(expediente!);
      console.log(expediente?.estudy!,"estudys");
      setData(expediente?.estudy!);
      setLoading(false);
    };

    if (id) {
      readExpedinte(id);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getById]);
  
/*   useEffect(()=>{
    if(!profile?.admin){
      form.setFieldsValue({sucursal:profile?.sucursal});
    }
    
  });
 */
/*   useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getnow(search);
    }

    readData(search);
  }, [search, getnow]) */

/*   useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getBranchOptions();
    }

    readData(search);
  }, [getBranchOptions]) */
  const setEditMode = () => {
    navigate(`/${views.proceeding}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const { Text } = Typography;
/*   const calcularEdad =(fecha:Date) =>{
    var hoy = new Date();
    var cumpleanos = fecha;
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    form.setFieldsValue({edad:edad});
    return edad;
}; */
  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];
    if(field=="edad"){
      const edad = changedValues[field] as number;
      var hoy = new Date();
      var cumpleaños =  hoy.getFullYear()-edad;
      hoy.setFullYear(cumpleaños);
      /* setValues((prev) => ({ ...prev, fechaNacimiento: hoy })) */
    }
    if (field === "cp") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
 /*          form.setFieldsValue({
            estado: location.estado,
            municipio: location.ciudad,
          }); */
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          /* clearLocation(); */
        }
      } else {
        /* clearLocation(); */
      }
    }
  };
  const setPage = (page: number) => {
/*     const priceList = expedientes[page - 1];
    navigate(`/${views.proceeding}/${priceList.id}?${searchParams}`); */
  };
  const getPage = (id: string) => {
    /* return expedientes.findIndex(x => x.id === id) + 1; */
    return 1;
  };
  const continues = async (cont: boolean) => {
    SetContinuar(cont);
  }

  const onFinish = async (newValues: IQuotationForm) => {
     setLoading(true);
      console.log(generales,"genreales");
    const reagent = { ...values, ...newValues };

      
      let success = false;
      reagent.generales = generales;
      reagent.expediente = record?.expediente!;
      reagent.estudy= data;
      console.log(reagent,"reagent");
      if (!reagent.id) {
        console.log("succes");
         success = await create(reagent);      
      } else{
         success = await update(reagent); 
      }
      setLoading(false);
      if (success) {

        goBack();
        
      } 

  };
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={10 ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={goBack}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton key="edit" title="Editar" image="editar" onClick={setEditMode} />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Expediente" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IQuotationForm>
            {...formItemLayout}
             form={form} 
            name="quotation"
             initialValues={values} 
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
            style={{marginBottom:"10px"}}
            onFinishFailed={({ errorFields }) => {
              const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
              setErrors(errors);
            }}
            size="small"
          >
            <Row gutter={[0, 12]}>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nomprePaciente",
                    label: "Nombre(s)",
                  }}
                  max={500}
                  showLabel
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "nomprePaciente")?.errors}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Expediente",
                  }}
                  max={500}
                  showLabel
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "expediente")?.errors}
                />
                <DateInput 
                  formProps={{
                      name: "fechaNacimiento",
                      label: "Fecha de Nacimiento",
                      
                    }}
                    errors={errors.find((x) => x.name === "fechaNacimiento")?.errors}
                />
                
              </Col>
              <Col md={12} sm={24} xs={12} >
              <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                  }}
                  mask={[
                    /[0-9]/,
                    /[0-9]/,
                    /[0-9]/,
                  ]}
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "edad")?.errors}
                ></NumberInput>
              </Col>
              <Col span={12}>
                        <SelectInput
                            formProps={{
                                name: "genero",
                                label: "Genero",
                            }}
                            options={[{ value: "M", label: "M" }, { value: "F", label: "F" }]}
                        ></SelectInput>
                    </Col>
            </Row>
          </Form>
          <Row>
            <Col  md={18} sm={24} xs={12}>
              <Tabs defaultActiveKey="1" >
                  <TabPane tab="Generales" key="1">
                    <GeneralesForm data={generales} generales={setGenerales} handle={generalesSumbit} printing={loading}></GeneralesForm>
                  </TabPane>
                  <TabPane tab="Estudios" key="2">
                    <ExpedientesForm setTotal={SetTotal} total={total!}  data={data} setData={setData} ></ExpedientesForm>
                  </TabPane>
                  <TabPane tab="Indiciaciones" key="3">
                    <IndiciacionesForm data={data} clave={""}></IndiciacionesForm>
                  </TabPane>
                  <TabPane tab="Busqueda" key="4">
                    <BusquedaForm handleCotizacion={setValues} handleIdExpediente={Setrecord} printing={loading}></BusquedaForm>
                  </TabPane>
              </Tabs>
            </Col>
            <Col  md={6} sm={24} xs={12}>
              <br />
              <br />
                <Descriptions
                  labelStyle={{ width: "60%", }}
                  className="request-description"
                  bordered
                  column={1}
                  size="small"
                >
                  <Descriptions.Item label="Cancelar">Modificar</Descriptions.Item>
                  

                <Descriptions.Item label="Total">{total}</Descriptions.Item>
                <Descriptions.Item
                    label={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text>Cargo</Text>
                        <Radio.Group size="small" className="request-radio"
                          
                        >
                          <Radio value={1}>%</Radio>
                          <Radio value={2}>$</Radio>
                        </Radio.Group>
                      </div>
                    }
                  >
                    {}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total">$ 630.00</Descriptions.Item>
              </Descriptions>
              <Button style={{marginTop:"10px", marginLeft:"100px",backgroundColor:"#B4C7E7",color:"white"}} onClick={()=>{}}>Imprimir</Button>
            </Col>
          </Row>


        </div>
      </div>
    </Spin>
  );
}

export default observer(QuotationForm);