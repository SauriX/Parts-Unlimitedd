import React, { FC, useEffect, useState } from "react";
import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Select, Input, Table, Checkbox } from "antd";
import { List, Typography } from "antd";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { IOptions } from "../../../app/models/shared";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/MaskInput";
import { IPackEstudioList, IPackForm, PackFormValues } from "../../../app/models/packet";
import views from "../../../app/util/view";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import Item from "antd/lib/list/Item";
import Study from "../../../views/Study";

const { Search } = Input;
type PackFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};
type UrlParams = {
  id: string;
};
const PackForm: FC<PackFormProps> = ({ componentRef, load }) => {
  const { optionStore,packStore } = useStore();
  const {getAll,getById,create,update,getAllStudy,packs,studies} = packStore;
  const [lista, setLista] = useState(studies);
  const [searchParams] = useSearchParams();
  const { getDepartmentOptions, departmentOptions,getareaOptions,areas } = optionStore;
  const navigate = useNavigate();
  const [form] = Form.useForm<IPackForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const [values, setValues] = useState<IPackForm>(new PackFormValues());
  let { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();
  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  };

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  useEffect(()=> {
    const areareader = async () => {
    await getareaOptions(0);
    setAreaSearch(areas);
    }
      areareader();
  }, [ getareaOptions]);
  const setStudy = (active:boolean,item:IPackEstudioList) =>{

    var index = lista.findIndex(x=>x.id==item.id);
    var list = lista;
    item.activo=active;
    list[index]=item;
    setLista(list);
    var indexVal= values.estudio.findIndex(x=>x.id==item.id);
    var val =values.estudio;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudio: val }));
   
}
useEffect(() => {
  const readuser = async (idUser: number) => {
    setLoading(true);
    console.log("here");
     const all = await getAll("all");
    console.log(all);
    var studis =await getAllStudy();
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
    readuser(Number(id));
  }
}, [form, getById , id]);
  /* useEffect(() => {
    const readStudy = async () =>{
      console.log("inicio");
      await getAllStudy();
      console.log("fin");
      console.log(studies);
      setLista(studies);
      console.log("useeffect");
      values.estudio.forEach(x=>{
        if(x.activo){
          console.log("entro");
          console.log(x);
          setStudy(x.activo,x);
        }
      });
      console.log(lista);
    }
    readStudy();
  }, []); */
  

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  
  const columnsEstudios: IColumns<IPackEstudioList> = [
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
  const filterByDepartament = async (departament:number) => {
    if(departament){
    var departamento=departmentOptions.filter(x=>x.value===departament)[0].label;
    var areaSearch=await getareaOptions(departament);
    
    var estudios = lista.filter(x=>x.departamento === departamento)
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
  const onFinish = async (newValues: IPackForm) => {
    setLoading(true);
    const User = { ...values, ...newValues };

      User.estudio=lista.filter(x=>x.activo==true);

      console.log("finish ");
      console.log(lista);
      console.log(User);
     let success = false;
    if (!User.id) {
      success = await create(User);
    } else {
      success = await update(User);
    } 

    setLoading(false);
    
    if (success) {
      navigate(`/${views.pack}?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualUser = () => {
    
    if (id) {
      const index = packs.findIndex((x) => x.id === Number(id));
      return  index +  1;
    }
    return 0;
  };
  const siguienteUser = (index: number) => {
     const user = packs[index];

    navigate(
      `/${views.pack}/${user?.id}?mode=${searchParams.get("mode")}&search=${
        searchParams.get("search") ?? "all"
      }`
    ); 
  };
  return (
    <Spin spinning={loading || load} tip={load ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={ packs?.length  ??  0}
              pageSize={1}
              current={actualUser()}
              onChange={(value) => {
                siguienteUser(value - 1);
              }}
            />
          </Col>
        )}
        {!CheckReadOnly() && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate(`/${views.pack}`);
              }}
            >
              Cancelar
            </Button>
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
        {CheckReadOnly() && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                navigate(`/${views.pack}/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`);
              }}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: load ? "none" : "" }}>
        <div ref={componentRef}>
          {load && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IPackForm>
            {...formItemLayout}
            form={form}
            name="branch"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />

                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "nombreLargo",
                    label: "Nombre Largo",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <SelectInput
                formProps={{ name: "idDepartamento", label: "Departamento" }}
                options={departmentOptions}
                readonly={CheckReadOnly()}
                required
              />
                            <SelectInput
                formProps={{ name: "idArea", label: "Área" }}
                options={areaForm}
                readonly={CheckReadOnly()}
                required
              />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <SwitchInput
                name="visible"
                label="Visible"
                onChange={(value) => {
                  if (value) {
                    alerts.info("El paquete será visble en la web");
                  } else {
                    alerts.info("El paquete ya no visble en la web");
                  }
                }}
                readonly={CheckReadOnly()}
              />
              <SwitchInput
                name="activo"
                label="Activo"
                onChange={(value) => {
                  if (value) {
                    alerts.info(messages.confirmations.enable);
                  } else {
                    alerts.info(messages.confirmations.disable);
                  }
                }}
                readonly={CheckReadOnly()}
                
              />
            </Col>
            </Row>
          </Form>
          <Divider orientation="left">Estudios</Divider>
          <Row>
          <Col md={4} sm={24} xs={12}>
          Búsqueda por :   
          </Col>
          <Col md={9} sm={24} xs={12}>
          <SelectInput 
                formProps={{ name: "departamentoSearch", label: "Departamento" }}
                options={departmentOptions}
                readonly={CheckReadOnly()}
                onChange={(value)=>{setAreaId(undefined); filterByDepartament(value)}}
              />

              </Col> 
              <Col md={2} sm={24} xs={12}></Col>
              <Col md={9} sm={24} xs={12}>
                <label htmlFor="">Área: </label>
                <Select
                /* formProps={{ name: "areaSearch", label: "Área" }} */
                options={aeraSearch}
                disabled={CheckReadOnly()}
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
          onSearch={(value) => {
           filterBySearch(value)
          }}
        />,</Col>
            <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
                <Table<IPackEstudioList>
                size="small"
                rowKey={(record) => record.id}
                columns={columnsEstudios.slice(0, 4)}
                pagination={false}
                dataSource={[...(values.estudio ?? [])]}
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(PackForm);
