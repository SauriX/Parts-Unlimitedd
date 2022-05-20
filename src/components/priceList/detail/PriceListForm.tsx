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
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/SelectInput";
import NumberInput from "../../../app/common/form/NumberInput";
import user from "../../../app/api/user";
import { IOptions } from "../../../app/models/shared";
const { Search } = Input;

type PriceListFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const visibleOptions = [
  { label: "Visible", value: "visible" },
  { label: "VisibleWeb", value: "web" },
];


const radioOptions = [
  { label: 'Sucursales', value: 'branch' },
  { label: 'Medicos', value: 'medic' },
  { label: 'Compañias', value: 'company' },
];

const PriceListForm: FC<PriceListFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { priceListStore, optionStore} = useStore();
  const { priceLists, getById, getAll, create, update,getAllStudy, getAllBranch, getAllMedics, getAllCompany, studies } = priceListStore;
  const { getDepartmentOptions, departmentOptions, getareaOptions, areas, } = optionStore;
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [lista, setLista] = useState(studies);
  const [form] = Form.useForm<IPriceListForm>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IPriceListForm>(
    new PriceListFormValues()
  );
  const [visibleType, setVisibleType] = useState<"visible" | "web">("visible");
  const setStudy = (active:boolean,item:IPriceListEstudioList) =>{

    var index = lista.findIndex(x=>x.id===item.id);
    var list = lista;
    item.activo=active;
    list[index]=item;
    setLista(list);
    var indexVal= values.estudios.findIndex(x=>x.id===item.id);
    var val =values.estudios;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudio: val }));
   
}
  useEffect(() => {
    const readPriceList = async (id: string) => {
      setLoading(true);
      const priceList = await getById(id);
      // await getareaOptions(priceList?.estudio.area);
      form.setFieldsValue(priceList!);
      setValues(priceList!);
      setLoading(false);
    };

    if (id) {
      readPriceList(id);
    }
  }, [form, getById, id]);

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

useEffect(() => {
  const readuser = async (idUser: string) => {
  var studis = await getAllStudy();
  var areaForm=await getareaOptions(values.idDepartamento);
  const user = await getById(idUser);
  form.setFieldsValue(user!);
  studis=studis?.map(x=>{
    var activo = user?.estudios.find(y=>y.id===x.id)!=null;
    return ({...x,activo})
  });
  setLista(studis!);  
  setAreaForm(areaForm!);
  console.log(studis);
  };
  if (id) {
    readuser(String(id));
  }
}, [form, getById , id]);

  useEffect(() => {
    if (priceLists.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, priceLists.length, searchParams]);

  const onFinish = async (newValues: IPriceListForm) => {
    setLoading(true);

    const priceList = { ...values, ...newValues };

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
    return priceLists.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const priceList = priceLists[page - 1];
    navigate(`/${views.price}/${priceList.id}?${searchParams}`);
  };

///Primera tabla Sucursal
console.log("Table");

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
      width: "30%",
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
    ...getDefaultColumnProps("", "Agregar", {
        searchState,
        setSearchState,
      width: "30%",
      windowSize: windowWidth,
    })
    ,
      render: (value, item) => (
        <Checkbox
        name="activo"
        checked={item.activo}
        //onChange={(value)=>{ console.log(value.target.checked); var active= false; if(value.target.checked){ console.log("here"); active= true;}setStudy(active,item)}}
      />
         
      ),
  },
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

  ///tabla Estudios/paquete
  console.log("Table");

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
      render: () => (
        <NumberInput
          formProps={{
          name: "cantidad"
          }}
          min={0}
          max={9999999999999999}
          readonly={readonly}
          />
         
      ),
    },
    {
        ...getDefaultColumnProps("area", "Area", {
          searchState,
          setSearchState,
          width: "30%",
          windowSize: windowWidth,
        }),
      },
  ];

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

                <Radio.Group
                  options={visibleOptions}
                  onChange={(e) => {
                    setVisibleType(e.target.value);
                  }}
                  value={visibleType}
                  
                />
              </Col>
            </Row>
          </Form>
          <Row justify="center">
            <Radio.Group
            options={radioOptions}
            onChange={ (e) =>{ 
              if (e.target.value === "branch" ){
              getAllBranch();
            }
             if (e.target.value === "medic" ){
              getAllMedics();
            }
            if (e.target.value === "company" ){
              getAllCompany();
            }
            
          }}
            optionType="button"
            buttonStyle="solid"
            />

            </Row>
            <Row><Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}></Col></Row>
            <Row><Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}></Col></Row>
            <Row>
            <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
                <Table<ISucMedComList>
                size="large"
                rowKey={(record) => record.id}
                columns={columns.slice(0, 3)}
                pagination={false}
                dataSource={[...(values.sucMedCom ?? [])]}
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                />
                {/* <Divider className="header-divider"/>
                <Divider className="header-divider"/> */}
            </Col>
          </Row>

          
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
                onChange={(value)=>{setAreaId(undefined); filterByDepartament(value)}}
                />
                </Col>
            <Col md={2} sm={24} xs={12}></Col>
            <Col md={9} sm={24} xs={12}>
              <label htmlFor="">Área: </label>
                <Select
                //formProps={{ name: "area", label: "Área" }} 
                options={areas} 
                onChange={(value)=>{ setAreaId(value); filterByArea(value)}}
                value={areaId}
                style={{width:"400px"}}
                disabled={readonly}  />
                </Col>
          </Row>
          
          <Row>
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
                <Table<IPriceListEstudioList>
                size="large"
                rowKey={(record) => record.id}
                columns={columnsEstudios.slice(0, 4)}
                pagination={false}
                dataSource={[...(values.estudios ?? [])]}
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(PriceListForm);
