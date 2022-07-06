import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber, Tabs } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import NumberInput from "../../../app/common/form/NumberInput";
import SelectInput from "../../../app/common/form/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
import moment from "moment";
import { ITaxData } from "../../../app/models/taxdata";
type QuotationFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const QuotationForm: FC<QuotationFormProps> = ({ id, componentRef, printing }) => {
  const navigate = useNavigate();
  const { modalStore,  locationStore, optionStore,profileStore } = useStore();
/*   const { getById, update, create, coincidencias, getnow, setTax, clearTax, expedientes, search, tax } = procedingStore; */
  const { profile } = profileStore;
  const { BranchOptions, getBranchOptions } = optionStore;
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  //const [form] = Form.useForm<IProceedingForm>();
 // const [values, setValues] = useState<IProceedingForm>(new ProceedingFormValues());
  const { getColoniesByZipCode } = locationStore;
  const { openModal,closeModal } = modalStore;
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [date, setDate] = useState(moment(new Date(moment.now())));
  const [continuar, SetContinuar] = useState<boolean>(true);
  const { TabPane } = Tabs;
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.proceeding}?${searchParams}`);
    closeModal();
  };

/*   const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  }; */


/*   useEffect(() => {
    const readExpedinte = async (id: string) => {
      setLoading(true);
      var expediente = await getById(id);
      
      const location = await getColoniesByZipCode(expediente?.cp!);
      if (location) {
        setColonies(
          location.colonias.map((x) => ({
            value: x.id,
            label: x.nombre,
          }))
        );
      } else {
        clearLocation();
      }
      form.setFieldsValue(expediente!);
      setTax(expediente?.taxData!);
      setValues(expediente!);
      setLoading(false);
    };

    if (id) {
      readExpedinte(id);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getById]); */
  
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

  const onFinish = async (newValues: any) => {
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
                /* form.submit(); */
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
          <Form<any>
            {...formItemLayout}
            /* form={form} */
            name="proceeding"
            /* initialValues={values} */
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre(s)",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                  }}
                  min={0}
                  readonly={readonly}
                ></NumberInput>
              </Col>
              <Col md={12} sm={24} xs={12}>
              <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Expediente",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <label htmlFor="" style={{marginLeft:"100px"}}>Fecha Nacimiento: </label>
                <DatePicker /* value={moment(values.fechaNacimiento)} */ disabled={readonly} /*onChange={(value) => {    calcularEdad(value?.toDate()!); */  /* setValues((prev) => ({ ...prev, fechaNacimiento: value?.toDate() })) }} */  />
              </Col>
            </Row>
          </Form>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Generales" key="1">
                Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Estudios" key="2">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Indiciaciones" key="3">
                Content of Tab Pane 3
                </TabPane>
                <TabPane tab="Busqueda" key="4">
                Content of Tab Pane 4
                </TabPane>
            </Tabs>
        </div>
      </div>
    </Spin>
  );
}

export default observer(QuotationForm);