import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag } from "antd";
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
import { IBranchDepartment } from "../../../app/models/branch";
import { IPackEstudioList } from "../../../app/models/packet";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
import { IDias, IPromotionBranch, IPromotionEstudioList, IPromotionForm, PromotionFormValues } from "../../../app/models/promotion";
import { IPriceListForm, ISucMedComList } from "../../../app/models/priceList";
import moment from "moment";
import PriceList from "../../../views/PriceList";
type ReagentFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const { Search } = Input;
const { CheckableTag } = Tag;

/* const priceListOptions:IOptions[] = [{value:"C50DDF00-3698-40A1-6D76-08DA39B72022",label:"test1"}]
 */
const PromotionForm: FC<ReagentFormProps> = ({ id, componentRef, printing }) => {
  const { optionStore,promotionStore } = useStore();
  const { getPriceById, getById, getAll, create, update } =promotionStore;
const {priceListOptions,getPriceListOptions, getDepartmentOptions, departmentOptions,getareaOptions,areas} = optionStore;
const { width: windowWidth } = useWindowDimensions();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [lista, setLista] = useState(/* studies */);
  const [searchParams, setSearchParams] = useSearchParams();
  const [areaId, setAreaId] = useState<number>();
  const [discunt, setDiscunt] = useState<number>();
  const [branch,setBranch] = useState<IOptions[]>();
  const [sucursal,setSucursal] = useState<ISucMedComList>();
  const [sucursales,setSucursales] = useState<ISucMedComList[]>([]);
  const [estudios,setEstudios] = useState<IPromotionEstudioList[]>([]);
  const [form] = Form.useForm<IPromotionForm>();
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [selectedTags, setSelectedTags] = useState<IDias[]>([]);
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<IPromotionForm>(new PromotionFormValues());
  
  const tagsData:IDias[] = [{id:1,dia:'L'}, {id:2,dia:'M'}, {id:3,dia:'M'}, {id:4,dia:'J'},{id:5,dia:'V'},{id:6,dia:'S'},{id:7,dia:'D'}];
  const radioOptions = [
    { label: 'Porcentaje', value: 'porcent' },
    { label: 'Cantidad', value: 'number' },
  ];
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  
  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idListaPrecios") {
      const id = changedValues[field] as string;
       const priceList = await getPriceById(id);
       var sucursales:ISucMedComList[] = priceList!.sucursales;
    console.log(priceList);
        setSucursales(sucursales);
       var sucursalesOptions:IOptions[] = sucursales.map((x)=>({
        value: x.id,
        label: x.nombre,
       })); 
       setBranch(sucursalesOptions);
       var estudios = priceList?.estudios.map(x=> {
        let data:IPromotionEstudioList = {
          id:x.id,
          clave:x.clave,
          nombre:x.nombre,
          descuentoPorcentaje:0,
          descuentoCantidad:0,
          lealtad:false,
          fechaInicial: moment().toDate(),
          fechaFinal:moment().toDate(),
          activo:false,
          precio: x.precio ,
          paquete:false,
        }
      return data;
       });

       setEstudios(estudios!);
       setValues((prev) => ({ ...prev, estudio: estudios! }));
       
    }


    
  };

  const handleChange=(tag:IDias, checked:Boolean)=>{

    const nextSelectedTags = checked ? [...selectedTags!, tag] : selectedTags.filter(t => t.id !== tag.id);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags( nextSelectedTags! );
  };
  const setStudy = (active:boolean,item:IPromotionEstudioList) =>{
/* 
    var index = lista.findIndex(x=>x.id==item.id);
    var list = lista;
    item.activo=active;
    list[index]=item;
    setLista(list);
    var indexVal= values.estudio.findIndex(x=>x.id==item.id);
    var val =values.estudio;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudio: val })); */
   
}
  useEffect(()=>{
    const readPriceList = async ()=>{
      await getPriceListOptions();
    }
    readPriceList();
  },[getPriceListOptions]);
  useEffect(() => {
    const readDepartaments = async () =>{
      var departaments= await getDepartmentOptions();
    }
    readDepartaments();
  }, [getDepartmentOptions]);
  useEffect(()=> {
    const areareader = async () => {
    await getareaOptions(0);
    setAreaSearch(areas);
    }
      areareader();
  }, [ getareaOptions]);
  const columnsEstudios: IColumns<IPromotionEstudioList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value,item) => (
        Number
      ),
    },
    {
        ...getDefaultColumnProps("area", "Área", {
          searchState,
          setSearchState,
          width: "30%",
          windowSize: windowWidth,
        }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value,item) => (
        <Checkbox
          name="activo"
          checked={item.activo}
          onChange={(value)=>{ console.log(value.target.checked); var active= false; if(value.target.checked){ console.log("here"); active= true;}setStudy(active,item)}}
        />
      ),
    }
  ];
  const filterByDepartament = async (departament:number) => {
    if(departament){
    var departamento=departmentOptions.filter(x=>x.value===departament)[0].label;
    var areaSearch=await getareaOptions(departament);
/*     
    var estudios = lista!.filter(x=>x.departamento === departamento) */
 /*    setValues((prev) => ({ ...prev, estudio: estudios })); */
    setAreaSearch(areaSearch!);}else{
 /*      var estudios = lista!.filter(x=>x.activo === true);
      setValues((prev) => ({ ...prev, estudio: estudios })); */
     
    }
    
  }
  const filterByArea = (area:number) => {
    var areaActive=areas.filter(x=>x.value===area)[0].label;
/*     var estudios = lista.filter(x=>x.area === areaActive) */
  /*   setValues((prev) => ({ ...prev, estudio: estudios })); */
  }
  const filterBySearch = (search:string)=>{
/*     var estudios = lista.filter(x=>x.clave.includes(search) || x.nombre.includes(search))
    setValues((prev) => ({ ...prev, estudio: estudios })); */
  }
/*   useEffect(() => {
    const readReagent = async (id: string) => {
      setLoading(true);
      const reagent = await getById(id);
      form.setFieldsValue(reagent!);
      setValues(reagent!);
      setLoading(false);
    };

    if (id) {
      readReagent(id);
    }
  }, [form, getById, id]);
 */
/*   useEffect(() => {
    if (reagents.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, reagents.length, searchParams]); */
  const deleteClinic = (id: string) => {
/*     const clinics = values.departamentos.filter((x) => x.departamentoId !== id);

    setValues((prev) => ({ ...prev, departamentos: clinics })); */
  };
  const addClinic = () => {
     if (sucursal) {
      if (values.branchs.findIndex((x) => x.id === sucursal.id) > -1) {
        alerts.warning("Ya esta agregada este departamento");
        return;
      }

      const branchs: ISucMedComList[] = [
        ...values.branchs,
        {
          id: sucursal.id,
          clave: sucursal.clave,
          nombre: sucursal.nombre,
          area:sucursal.area,
          activo: sucursal.activo,
          departamento: sucursal.departamento,
        },
      ];

      setValues((prev) => ({ ...prev, branchs: branchs }));
      console.log(values);
    } 
  };
  const onFinish = async (newValues: IPromotionForm) => {
    setLoading(true);

    const reagent = { ...values, ...newValues };
    console.log(reagent);
    let success = false;

    if (!reagent.id) {
      //success = await create(reagent);
    } else {
      //success = await update(reagent);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.reagent}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.reagent}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    //return reagents.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    //const reagent = reagents[page - 1];
    //navigate(`/${views.reagent}/${reagent.id}?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
{/*             <Pagination
              size="small"
              total={reagents?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            /> */}
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
              title={<HeaderTitle title="Catálogo de Promociones en listas de precios" image="promo" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IPromotionForm>
            {...formItemLayout}
            form={form}
            name="reagent"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
                <SelectInput
                    formProps={{
                      name: "idListaPrecios",
                      label: "Lista de precios",
                    }}
                    required
                    options={priceListOptions}
                    readonly={readonly}
                  />
              </Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <SwitchInput
                  name="activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  label="Activo"
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
                <div style={{marginLeft:"85px",marginBottom:"20px"}}>
                  Tipo de descuento: 
                  <Radio.Group  style={{marginLeft:"10px"}}
                    options={radioOptions}
                    onChange={(e) => {
                    setDiscunt(e.target.value);
                    }}
                    value={discunt}
                  />
                </div>
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                  <NumberInput
                      formProps={{
                        name: "descuento",
                        label: "Descuento",
                      }}
                      max={100}
                      min={0}
                      required
                      readonly={readonly}
                  ></NumberInput>
              </Col>
              <Col md={12} sm={24} xs={12}>
              <SwitchInput
                  name="lealtad"
                  onChange={(value) => {
                    if (value) {
                      alerts.info("se aplicara lealtad");
                    } else {
                      alerts.info("ya no se aplicara lealtad");
                    }
                  }}
                  label="Lealtad"
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <div style={{marginLeft:"98px",marginBottom:"20px"}}>
                Descuento entre: 
                <DatePicker style={{marginLeft:"10px"}} value={moment(values.fechaInicial)} onChange={(value)=>{console.log(value)}} />
                <DatePicker style={{marginLeft:"10px"}} value={moment(values.fechaFinal)} onChange={(value)=>{console.log(value)}} />
              </div>
              </Col>
              <Col md={12} sm={24} xs={12}>
              <div style={{marginLeft:"125px",marginBottom:"20px"}}>
                <span style={{ marginRight: 8 }}>Aplicar dias:</span>
                {tagsData.map(tag => (
                  <CheckableTag
                    key={tag.id}
                    checked={selectedTags.filter(x=>x.id===tag.id).length>0}
                    onChange={checked => handleChange(tag, checked) }
                  >
                    {tag.dia}
                  </CheckableTag>
                ))}
              </div>
              </Col>
            </Row>
          </Form>
          <div>
        <div></div>
      </div>
      <Divider orientation="left">Sucursales</Divider>
      <List<ISucMedComList>
        header={
          <div>
            <Col md={12} sm={24} style={{ marginRight: 20 }}>
            Clave/Nombre:
              <Select
                options={branch}
                onChange={(value, option: any) => {
                  if (value) {
                    var sucursal = sucursales.filter(x=>x.id==value);
                    setSucursal(sucursal[0]);
                  } else {
                    setSucursal(undefined);
                  }
                }}
                style={{ width: 240, marginRight: 20, marginLeft: 10 }}
              />
              {!readonly && (
                <ImageButton
                  key="agregar"
                  title="Agregar "
                  image="agregar-archivo"
                  onClick={addClinic}
                />
              )}
            </Col>
          </div>
        }
        footer={<div></div>}
        bordered
        dataSource={values.branchs}
        renderItem={(item) => (
          <List.Item>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <Typography.Text mark></Typography.Text>
              {item.nombre}
            </Col>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <ImageButton
                key="Eliminar"
                title="Eliminar Clinica"
                image="Eliminar_Clinica"
                onClick={() => {
                  deleteClinic(item.id);
                }}
              />
            </Col>
          </List.Item>
        )}
      />
      <Divider orientation="left">Estudios</Divider>
          <Row>
          <Col md={4} sm={24} xs={12}>
          Búsqueda por :   
          </Col>
          <Col md={9} sm={24} xs={12}>
          <SelectInput 
                formProps={{ name: "departamentoSearch", label: "Departamento" }}
                options={departmentOptions}
                readonly={readonly}
                onChange={(value)=>{setAreaId(undefined); filterByDepartament(value)}}
              />

              </Col> 
              <Col md={2} sm={24} xs={12}></Col>
              <Col md={9} sm={24} xs={12}>
                <label htmlFor="">Área: </label>
                <Select
                /* formProps={{ name: "areaSearch", label: "Área" }} */
                options={aeraSearch}
                disabled={readonly}
                onChange={(value)=>{ setAreaId(value); filterByArea(value)}}
                value={areaId}
                style={{width:"400px"}}
              />
              </Col>
              <Col md={15} sm={24} xs={12}></Col>
              <Col md={9} sm={24} xs={12}>
              <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value: string) => {
           filterBySearch(value)
          }}
        />,</Col>
            <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
                <Table<IPromotionEstudioList>
                size="small"
                rowKey={(record) => record.id}
                columns={columnsEstudios.slice(0, 4)}
                pagination={false}
                dataSource={[...( values.estudio)]}
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(PromotionForm);
