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
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/SelectInput";
import NumberInput from "../../../app/common/form/NumberInput";
import user from "../../../app/api/user";
import { IOptions } from "../../../app/models/shared";
import Study from "../../../views/Study";
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
  { label: "Sucursales", value: "branch" },
  { label: "Medicos", value: "medic" },
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
    studies,
    sucMedCom,
  } = priceListStore;
  const { getDepartmentOptions, departmentOptions, getareaOptions, areas } =
    optionStore;
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lista, setLista] = useState(studies);
  const [listSMC, setListSCM] = useState(sucMedCom);
  const [listSucursal, setListSucursal] = useState<any>();
  const [listMedicos, setListMedicos] = useState<any>();
  const [listCompañia, setListCompañia] = useState<any>();
  const [form] = Form.useForm<IPriceListForm>();

  const [estudy, setEstudy] = useState<{ clave: ""; id: string; nombre: ""; precio:number; }>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IPriceListForm>(
    new PriceListFormValues()
  );

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  useEffect(() => {
    const areareader = async () => {
      await getareaOptions(0);
      setAreaSearch(areas);
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
  const setStudy = (active: boolean, item: IPriceListEstudioList) => {
    var index = lista.findIndex(x => x.id == item.id);
    var list = lista;
    item.activo = active;
    list[index] = item;
    setLista(list);
    var indexVal= values.estudios.findIndex(x=>x.id===item.id);
    var val =values.estudios;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudios: val }));
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

  const setStudyPrice = (newprecio:number,item:IPriceListEstudioList) =>{
    var index = lista.findIndex(x=>x.id==item.id);
    var list = lista;
    item.precio = newprecio;
    list[index]=item;
   // setLista(list); 
    var indexVal= values.estudios.findIndex(x=>x.id==item.id);
    var val =values.estudios;
    val[indexVal]=item;
    setValues((prev) => ({ ...prev, estudio: val })); 
       
    }
// red user 146
  useEffect(() => {
    const readuser = async (idUser: string) => {
      setLoading(true);
      console.log("here getDepartament");
      const all = await getAll("all");
      console.log(all);
      var studis = await getAllStudy();
      var areaForm = await getareaOptions(values.idDepartamento);

      const user = await getById(idUser);
      console.log("Lista de precio", user);
      const branches = await getAllBranch();
      const Companies = await getAllCompany();
      const medics = await getAllMedics();


      form.setFieldsValue(user!);
      studis = studis?.map(x => {
        var activo = user?.estudios.find(y=> y.id === x.id) != null;
        return { ...x, activo };
      });
      setListSucursal(branches);
      setListCompañia(Companies);
      setListMedicos(medics);
      setAreaForm(areaForm!);
      setValues(user!);
      setLista(studis!);
      setLoading(false);
      
      user?.sucursales.map(x => setSucursalesList(x.activo!,x,branches));
      user?.compañia.map(x => setCompañiasList(x.activo!,x,Companies));
      user?.medicos.map(x =>setMedicosList(x.activo!,x,medics));
      setListSCM(listSucursal);
      setRadioValue("branch");
      console.log(studis);
    };
    if (id) {
      readuser(String(id));
    }
  }, [form, getById, id]);

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
            console.log(value.target.checked);
            var active = false;
            if (value.target.checked) {
              console.log("here check sucmedcom");
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
      var areaForm = await getareaOptions(value);
      setAreaForm(areaForm!);
      form.setFieldsValue({ idArea: undefined });
    }
  };

  const filterByDepartament = async (departament: number) => {
    if (departament) {
      var departamento = departmentOptions.filter(
        x => x.value === departament
      )[0].label;
      var areaSearch = await getareaOptions(departament);

      console.log("Filtro")
      var estudios = lista.filter(x => x.departamento === departamento);
      setValues((prev) => ({ ...prev, estudios: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      estudios = lista.filter(x => x.activo === true);
      setValues((prev) => ({ ...prev, estudios: estudios }));
    }
    // console.log("departament");
    // console.log(values);
  }
  const filterByArea = (area: number) => {
    var areaActive = areas.filter(x => x.value === area)[0].label;
    var estudios = lista.filter(x => x.area === areaActive);
    setValues((prev) => ({ ...prev, estudios: estudios }));
  }
  const filterBySearch = (search: string) => {
    var estudios = lista.filter(
      (x) => x.clave.includes(search) || x.nombre.includes(search) );
    setValues((prev) => ({ ...prev, estudios: estudios }));
  }

  const onFinish = async (newValues: IPriceListForm) => {
    setLoading(true);

    const priceList = { ...values, ...newValues };
    priceList.estudios=lista.filter(x=>x.activo==true);

    //priceList.estudios = lista;
    console.log("finish ");
    console.log(lista);
    console.log(priceList);
    priceList.sucursales=listSucursal;
    priceList.compañia=listCompañia;
    priceList.medicos=listMedicos;
    console.log(priceList);
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
        <input type={"number"}  
        value={item.precio}  
        onChange={(value)=>setStudyPrice(Number(value.target.value),item)}>

        </input>
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
              active= true;}setStudy(active,item)}}
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
          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            >
              <Table<ISucMedComList>
                size="large"
                rowKey={(record) => record.id}
                columns={columns.slice(0, 3)}
                pagination={false}
                dataSource={listSMC}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
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
                onChange={(value) => {
                  setAreaId(undefined);
                  filterByDepartament(value);
                }}
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
                value={areaId}
                style={{ width: "400px" }}
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

            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            >
              <Table<IPriceListEstudioList>
                size="large"
                rowKey={(record) => record.id}
                columns={columnsEstudios.slice(0, 5)}
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
