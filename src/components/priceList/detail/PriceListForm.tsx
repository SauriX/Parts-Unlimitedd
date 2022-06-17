import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Radio,
  Table,
  Input,
  Checkbox,
  Select,
  InputNumber,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import {
  IPriceListEstudioList,
  IPriceListForm,
  ISucMedComList,
  PriceListFormValues,
} from "../../../app/models/priceList";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/SelectInput";


const { Search } = Input;

type PriceListFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};


const radioOptions = [
  { label: "Sucursales", value: "branch" },
  { label: "Médicos", value: "medic" },
  { label: "Compañias", value: "company" },
];

const PriceListForm: FC<PriceListFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { priceListStore, optionStore } = useStore();
  const {
    priceLists,
    getById,
    getAll,
    create,
    update,
    getAllStudy,
    getAllBranch,
    getAllMedics,
    getAllCompany,
    getAllPack,
    studies,
    sucMedCom,
  } = priceListStore;
  const { getDepartmentOptions, departmentOptions, getareaOptions, areas } =
    optionStore;

  const [areaId, setAreaId] = useState<number>();
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lista, setLista] = useState<IPriceListEstudioList[]>(studies);
  const [listSMC, setListSCM] = useState(sucMedCom);
  const [listSucursal, setListSucursal] = useState<any>();
  const [listMedicos, setListMedicos] = useState<any>();
  const [listCompañia, setListCompañia] = useState<any>();
  const [form] = Form.useForm<IPriceListForm>();
  const [loading, setLoading] = useState(false);
  const [depId, setDepId] = useState<number>();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [values, setValues] = useState<IPriceListForm>(
    new PriceListFormValues()
  );

  useEffect(()=>{
    const readtabla = async() =>{
       let estudiostabla = await getAllStudy();
       let paquetestabla = await getAllPack();
       let tabla = estudiostabla!.concat(paquetestabla!);
       console.log(tabla);
       setValues((prev) => ({ ...prev, table: tabla }));
       setLista(tabla);
    }
    if(!id){
      readtabla();
    }
  },[getAllStudy,getAllPack,id]);

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  useEffect(() => {
    const areareader = async () => {
      await getareaOptions(0);
     
    };
    areareader();
  }, [getareaOptions]);

  useEffect(()=>{
    const readtable = async () =>{
      const branches = await getAllBranch();
      const Companies = await getAllCompany();
      const medics = await getAllMedics();
      setListSucursal(branches);
      setListCompañia(Companies);
      setListMedicos(medics);
      if(!id){
        setListSCM(branches);
        setRadioValue("branch");
      }

    }
    readtable();
  },[getAllBranch,getAllCompany, getAllMedics]);

  const setSCMlist=async (listatype:string)=>{
      switch(listatype){
        case "sucursal":
          setListSCM(listSucursal);
        break;
        case "compañia":
          setListSCM(listCompañia);
        break;
        case "medicos":
          setListSCM(listMedicos);
        break;

      }
      console.log(listMedicos);
      console.log(listCompañia);
      console.log(listSucursal);
  }
  const setStudy = (active: boolean, item: IPriceListEstudioList,typePAck:boolean,first:boolean=false,values:IPriceListForm) => {
    console.log(first,"bandera");
     let estudiosSinPrecio:IPriceListEstudioList[] =[];
    console.log(item,"item");
    if(!first){
      console.log("entro");
      if(active){
        if(typePAck){
          let estudiosPaquete = item.pack;
          let estudiosValidar :IPriceListEstudioList[] =[];
    
          estudiosPaquete?.forEach(x=>{
            var estudy = lista.find(y=> y.id === x.id && !y.paqute);
            estudiosValidar.push(estudy!);
          });
    
          estudiosValidar?.forEach(x=>{ if(x.precio===0||x.activo===false){
            estudiosSinPrecio.push(x);
          }});
          if(estudiosSinPrecio.length>0){
            estudiosSinPrecio.forEach(X=>alerts.warning(`El estudio ${X.nombre} no tiene precio asignado`));
    
            return
          }else{
            var precio= 0;
            for (let i = 0; i < estudiosValidar.length; i++) {
              precio += estudiosValidar[i]!.precio!;
            }
            item.precio=precio;
          }
          
        } 
      }
    }


    var index = lista.findIndex(x => x.id === item.id  && x.paqute===typePAck);
    var list = lista;
    item.activo = active;
    
    console.log(item.precio,"precio");
    list[index] = item;
    setLista(list);
    console.log(values,"values");
    var indexVal= values.table!.findIndex(x=>x.id===item.id && x.paqute===typePAck);
    var val =values.table;
    
    val![indexVal]=item;
    console.log(val,"val");
    setValues((prev) => ({ ...prev, table: val }));
    console.log(values,"vaulues");
    console.log("entra el estudio seleccionado")
  };

  const setSucMedCom = (active: boolean, item: ISucMedComList) => {
    var index = listSMC.findIndex((x) => x.id === item.id);
    var list = listSMC;
    item.activo = active;
    list[index] = item;
    setListSCM(list);
    var indexVal = values.sucMedCom.findIndex((x) => x.id === item.id);
    var val = values.sucMedCom;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, sucMedCom: val }));
    console.log("entra")

  };

  const setStudyPrice = (newprecio:number,item:IPriceListEstudioList,typePAck:boolean) =>{
    if(newprecio<0){
      alerts.warning("El Precio tiene que ser mayor a 0");
      return;
    }
    var index = lista.findIndex(x=>x.id===item.id  && x.paqute===typePAck);
    var list = lista;
    item.precio = newprecio;
    list[index]=item;
    var indexVal= values.table!.findIndex(x=>x.id===item.id  && x.paqute===typePAck);


    var val =values.table!;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, table: val })); 
       
    }
// red user 146
  useEffect(() => {
    const readuser = async (idUser: string) => {
      setLoading(true);
      const user = await getById(idUser);
      console.log(user,"here getDepartament");
      const all = await getAll("all");
      console.log(all);
      var studis = await getAllStudy();
      var pcks = await getAllPack();
      console.log(pcks,"paquetes");
      var tabla = studis!.concat(pcks!);

      
      console.log("Lista de precio", user);
      const branches = await getAllBranch();
      const Companies = await getAllCompany();
      const medics = await getAllMedics();
      if(user!.paquete){
        user!.paquete = user!.paquete.map(x=>{x.paqute=true; return x;});
      }
      
      var listatabla = user?.estudios.concat(user?.paquete);
      user!.table = listatabla?.filter(x=> x!=null);
      var studys =  user!.table!;
      user!.table = tabla;
      user!.sucMedCom = user!.sucursales;
      setValues(user!);
      form.setFieldsValue(user!);
      setLista(user?.table!);
      console.log(user);
      setListSucursal(branches);
      setListCompañia(Companies);
      setListMedicos(medics);
  
      console.log(tabla,"estudios y paquetesa");
      
     
      console.log("seteado");
      
      console.log("inicia el foreach");
      studys.forEach(x=>{setStudy(x.activo!,x,x.paqute!,true,user!); console.log("item");});
      user?.sucursales.map(x => setSucursalesList(x.activo!,x,branches));
      user?.compañia.map(x => setCompañiasList(x.activo!,x,Companies));
      user?.medicos.map(x =>setMedicosList(x.activo!,x,medics));
      console.log(user!.sucursales!.length<=0,"evaluacion");
      setListSCM(user!.sucursales!.length<=0 ?  branches! : user!.sucursales);
      setRadioValue("branch");
      console.log(studis);
      console.log("values");
      
      setLoading(false);
 
      
    };
    if (id) {
      readuser(String(id));
    }
  }, [form, getById, id,getAll,getAllBranch,getAllCompany,getAllMedics,getAllPack,getAllStudy]);

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.price}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.price}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return priceLists.findIndex(x => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const priceList = priceLists[page - 1];
    setAreaId(undefined);
     setDepId(undefined);
    navigate(`/${views.price}/${priceList.id}?${searchParams}`);
  };

  const setSucursalesList = (active: boolean, item: ISucMedComList,lists:ISucMedComList[]) =>{
    console.log(lists,"Lista en metodo");
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
    setListSucursal(list);
  }
  const setMedicosList = (active: boolean, item: ISucMedComList,lists:ISucMedComList[]) =>{
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
    setListMedicos(list);
  }
  const setCompañiasList = (active: boolean, item: ISucMedComList,lists:ISucMedComList[]) =>{
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
  setListCompañia(list);
  }
  ///Primera tabla Sucursal
  //console.log("Table");
   
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ISucMedComList> = [
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
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("listaPrecio", "Lista de precios", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      //Aqui es lo mismo que con el estudio
      //Pero no vinculado al setstudy
      render: (value, item) => (
        <Checkbox
          name="activo"
          checked={item.activo}
          onChange={(value) => {
            console.log(item,"here check sucmedcom");
            console.log(value.target.checked);
            var active = false;
            if (value.target.checked) {
              
              active = true;
            }
            setSucMedCom(active, item);
          }}
        />
      ),
    },
  ];

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idDepartamento") {
      console.log("deparatemento on values change");
      const value = changedValues[field];
     
      form.setFieldsValue({ idArea: undefined });
    }
  };

  const filterByDepartament = async (departament: number) => {
    console.log(lista,"lalista");
    if (departament) {
      var departamento = departmentOptions.filter(
        x => x.value === departament
      )[0].label;
      var areaSearch=await getareaOptions(departament);

      console.log("Filtro")
      var estudios = lista.filter(x => x.departamento === departamento);
      console.log(lista,"lista");
      console.log(estudios,"el estudio");
      setValues((prev) => ({ ...prev, table: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      estudios = lista
      if(estudios.length<=0){
        estudios=lista      
      }
      setValues((prev) => ({ ...prev, table: estudios }));
    }
    // console.log("departament");
    // console.log(values);
  }
  const filterByArea = (area?: number) => {
    if (area) {
      var areaActive = areas.filter((x) => x.value === area)[0].label;
      var estudios = lista.filter((x) => x.area === areaActive);
      setValues((prev) => ({ ...prev, table: estudios }));
    } else {
      const dep = departmentOptions.find((x) => x.value === depId)?.label;
      estudios = lista.filter((x) => x.departamento === dep);
      setValues((prev) => ({ ...prev, table: estudios }));
    }
  }
  const filterBySearch = (search: string) => {
    var estudios = lista.filter(
      (x) => x.clave.includes(search) || x.nombre.includes(search) );
    setValues((prev) => ({ ...prev, table: estudios }));
  }

  const onFinish = async (newValues: IPriceListForm) => {
    setLoading(true);

    const priceList = { ...values, ...newValues };
    console.log(lista);
    priceList.promocion=[];
    //priceList.estudios = lista;
    priceList.sucursales=listSucursal.filter((x:ISucMedComList)=>x.activo==true);
    priceList.compañia=listCompañia.filter((x:ISucMedComList)=>x.activo==true);
    priceList.medicos=listMedicos.filter((x:ISucMedComList)=>x.activo==true);

    priceList.estudios= priceList.table!.filter(x=> x.activo===true &&( x.paqute===false || !x.paqute));
    priceList.paquete= priceList.table!.filter(x=> x.activo && x.paqute===true);
    console.log(priceList,"LISTA");
    let success = false;
    if (!priceList.id) {
      success = await create(priceList);
    } else {
      success = await update(priceList);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  ///tabla Estudios/paquete


  const columnsEstudios: IColumns<IPriceListEstudioList> = [
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
      ...getDefaultColumnProps("precio", "Precio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
      render: (value,item) => (
        <InputNumber type={"number"}  
        value={item.precio}  
        onChange={(value)=>setStudyPrice(value,item,item.paqute!)}
        
        >

        </InputNumber>
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
          
          onChange={(value1)=>{ 
            console.log(item, "item")
            console.log(value1.target.checked); var active= false; 
            if(value1.target.checked){ 
              console.log("here check box estudio a listaPrice"); 
              active= true;}
              
              setStudy(active,item,item.paqute!,false,values!)}}

        
        />
      ),
    }
  ];

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={priceLists?.length ?? 0}
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
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle
                  title="Catálogo de Lista de Precios"
                  image="ListaPrecio"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IPriceListForm>
            {...formItemLayout}
            form={form}
            name="priceList"
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
                <Col md={12} sm={24} xs={12}></Col>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <Col md={12} sm={24} xs={12}></Col>
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
              <SwitchInput
                  name="visibilidad"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.visible);
                    } else {
                      alerts.info(messages.confirmations.visibleweb);
                    }
                  }}
                  label="Visible"
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>
          <Row justify="center">
            <Radio.Group
              value={radioValue}
              options={radioOptions}
              onChange={async (e) => {
                if (e.target.value === "branch") {
                  
                  setSCMlist("sucursal");
                  setRadioValue("branch");
                }
                if (e.target.value === "medic") {

                  setSCMlist("medicos");
                  setRadioValue("medic");
                }
                if (e.target.value === "company") {
                  
                  setSCMlist("compañia");
                  setRadioValue("company");
                }
              }}
              optionType="button"
              buttonStyle="solid"
            />
          </Row>
          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            ></Col>
          </Row>
          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            ></Col>
          </Row>
              <Table<ISucMedComList>
                size="large"
                rowKey={(record) => record.id}
                columns={printing?columns.slice(0, 4):columns}
                pagination={false}
                dataSource={listSMC}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
              />


          <Divider orientation="left">Estudios</Divider>
          <Row justify="center">
            <Col md={4} sm={24} xs={12}>
              Búsqueda por :
            </Col>
            <Col md={9} sm={24} xs={12}>
              <SelectInput
                formProps={{ name: "departamento", label: "Departamento" }}
                options={departmentOptions}
                readonly={readonly}
                required
                value={depId} 
                onChange={(value)=>{setAreaId(undefined); setDepId(value); filterByDepartament(value)}}
              />
            </Col>
            <Col md={2} sm={24} xs={12}></Col>
            <Col md={9} sm={24} xs={12}>
              <label htmlFor="">Área: </label> 
              <Select

                //formProps={{ name: "area", label: "Área" }}
                options={areas}
                onChange={(value) => {
                  setAreaId(value);
                  filterByArea(value);
                }}
                allowClear
                onClear={() => {
                  setAreaId(undefined);
                  filterByArea();
                }}
                value={areaId}
                style={{ width: "400px" ,marginLeft:"2px"}}
                disabled={readonly}
              />
            </Col>
          </Row>

          <Row>
            <Col md={15} sm={24} xs={12}></Col>
            <Col md={9} sm={24} xs={12}>
              <Search
                key="search"
                placeholder="Buscar"
                onSearch={(value) => {
                  filterBySearch(value);
                }}
              />
              ,
            </Col>
          </Row>

              <Table<IPriceListEstudioList>
                size="large"
                columns={printing?columnsEstudios.slice(0,4):columnsEstudios}
                pagination={false}
                dataSource={[...(values.table ?? [])]}
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                />

        </div>
      </div>
    </Spin>
  );
};

export default observer(PriceListForm);
