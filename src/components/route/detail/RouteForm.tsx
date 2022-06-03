import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Select, Checkbox, Input, Table } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import {useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { IRouteEstudioList, IRouteForm, RouteFormValues } from "../../../app/models/route";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { IOptions } from "../../../app/models/shared";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import NumberInput from "../../../app/common/form/NumberInput";

const { Search } = Input;
type RouteFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

type UrlParams = {
  id: string;
};

const RouteForm: FC<RouteFormProps> = ({  componentRef, printing }) => {
  const { optionStore, routeStore } = useStore();
  const { routes, getById, getAll, create, update,getAllStudy, studies } = routeStore;
  const [lista, setLista] = useState(studies);
  const { getDepartmentOptions, departmentOptions,getareaOptions,areas } = optionStore;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<IRouteForm>();
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const [depId, setDepId] = useState<number>();
  const [searchvalue, setSearchvalue] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [values, setValues] = useState<IRouteForm>(new RouteFormValues());
  let { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();

  
  useEffect(() => {
    const studys = async () => {
      let estudio = await getAllStudy();
      setLista(estudio!);
      setValues((prev) => ({ ...prev, estudio: estudio! }));
    }
    if(!id){
      studys();
    }
    
  }, [getAllStudy]);
  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);
  useEffect(()=> {
    const areareader = async () => {
    await getareaOptions(0);
    setAreaSearch(areas);
    setAreaForm(areas);
    }
      areareader();
  }, [ getareaOptions]);
  
useEffect(() => {
  console.log("use");
  const readuser = async (idUser: string) => {
    setLoading(true);
    console.log("here");
     const all = await getAll("all");
    console.log(all);
    var studis =await getAllStudy();
    console.log(studies,"estudios");
    var areaForm=await getareaOptions(values.idDepartamento);
      
    const user = await getById(idUser);
    form.setFieldsValue(user!);
    studis=studis?.map(x=>{
      var activo = user?.estudio.find(y=>y.id===x.id)!=null;
      return ({...x,activo})
    });
    setAreaForm(areaForm!);
    setValues(user!);
    setLista(studis!);
    setLoading(false);
    console.log(studis);
  };
  if (id) {
    readuser(String(id));
  }else{
    form.setFieldsValue({idDepartamento:undefined,idArea:undefined});
  }
}, [form, getById , id]);

  

  useEffect(() => {
    if (routes.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, routes.length, searchParams]);

  const onFinish = async (newValues: IRouteForm) => {
    setLoading(true);

    const route = { ...values, ...newValues };

    route.estudio=lista.filter(x=>x.activo==true);

    let success = false;

    if (!route.id) {
      success = await create(route);
    } else {
      success = await update(route);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.route}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.route}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return routes.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const route = routes[page - 1];
    navigate(`/${views.route}/${route.id}?${searchParams}`);
  };

  
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  
  const columnsEstudios: IColumns<IRouteEstudioList> = [
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
        ...getDefaultColumnProps("area", "Área", {
          searchState,
          setSearchState,
          width: "20%",
          windowSize: windowWidth,
        }),
    },
    {
      ...getDefaultColumnProps("departamento", "Departamento", {
        searchState,
        setSearchState,
        width: "20%",
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
    ,
    {
      key: "selectAll",
      dataIndex: "id",
      title: "Seleccionar todos",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value,item) => (
        "All Might"
      ),
    }
  ];

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idDepartamento") {
      console.log("deparatemento");
      const value = changedValues[field];
      var areaForm=await getareaOptions(value);
      setAreaForm(areaForm!);
      form.setFieldsValue({idArea:undefined});

    }
  };

  const setStudy = (active:boolean,item:IRouteEstudioList) =>{
    var index = lista.findIndex(x=>x.id==item.id);
    var list = lista;
    item.activo=active;
    list[index]=item;
    setLista(list);
    var indexVal= values.estudio.findIndex(x=>x.id==item.id);
    var val =values.estudio;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudio: val }));
   
  };

  const filterByDepartament = async (departament:number) => {
    if(departament){
    var departamento=departmentOptions.filter(x=>x.value===departament)[0].label;
    var areaSearch=await getareaOptions(departament);
    console.log(departamento,"departamento");
    var estudios = lista.filter(x=>x.departamento === departamento);
    console.log(lista,"lista");
    console.log(estudios,"estudios filtro dep");
    setValues((prev) => ({ ...prev, estudio: estudios }));
    setAreaSearch(areaSearch!);}else{
      var estudios = lista.filter(x=>x.activo === true);
      setValues((prev) => ({ ...prev, estudio: estudios }));
     
    }
    
  }

  const filterByArea = (area:number) => {
    var areaActive=areas.filter(x=>x.value===area)[0].label;
    var estudios = lista.filter(x=>x.area === areaActive)
    setValues((prev) => ({ ...prev, estudio: estudios }));
  }
  const filterBySearch = (search:string)=>{
    var estudios = lista.filter(x=>x.clave.includes(search) || x.nombre.includes(search))
    setValues((prev) => ({ ...prev, estudio: estudios }));
  }

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={routes?.length ?? 0}
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
              title={<HeaderTitle title="Catálogo de Rutas" image="route" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IRouteForm>
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
              <Col md={12} sm={24} xs={12}></Col>
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
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "sucursalOrigenId",
                    label: "Sucursal Origen",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "sucursalDestinoId",
                    label: "Destino",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
              <TextAreaInput
                  formProps={{
                    name: "comentarios",
                    label: "Comentarios",
                  }}
                  max={500}
                  rows={5}
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
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
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <TextInput
                  formProps={{
                    name: "paqueteriaId",
                    label: "Paqueteria",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "horaDeRecoleccion",
                    label: "Hora de Recoleccion",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "tiempoDeEntrega",
                    label: "Tiempo de Entrega",
                  }}
                  min={0}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>
          <Divider orientation="center">Asignación de Estudios</Divider>
          <Row>
          <Col md={4} sm={24} xs={12}>
          Búsqueda por :   
          </Col>
          <Col md={9} sm={24} xs={12}>
          <label htmlFor="">Departamentos: </label>
          <Select
                 style={{width:"350px"}}
                options={departmentOptions}
                disabled={readonly}
                onChange={(value)=>{setAreaId(undefined); setDepId(value); filterByDepartament(value)}}
                allowClear
                 value={depId} 
                 placeholder={"Departamentos"}
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
                allowClear
                style={{width:"400px"}}
                placeholder={"Área"}
              />
              </Col>
              <Col md={15} sm={24} xs={12}></Col>
              <Col md={9} sm={24} xs={12}>
              <label htmlFor="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <Search
              style={{width:"400px",marginTop:"20px",marginBottom:"20px"}}
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
           filterBySearch(value);
           setSearchvalue(value);
          }}
          onChange={(value) => {
            
            setSearchvalue(value.target.value);
           }}
          value={searchvalue}
        />,</Col>
            <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
                <Table<IRouteEstudioList>
                size="small"
                rowKey={(record) => record.id}
                columns={columnsEstudios.slice(0, 6)}
                pagination={false}
                dataSource={[...(values.estudio ?? [])]}
                // scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                scroll={{ y: 240 }}
                />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(RouteForm);
