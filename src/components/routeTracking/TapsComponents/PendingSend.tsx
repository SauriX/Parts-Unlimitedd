import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  PageHeader,
  Row,
  Table,
  Tag,
} from "antd";
import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { EditOutlined } from "@ant-design/icons";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import {
  IsamplingForm,
  IsamplingList,
  IUpdate,
  samplingFormValues,
} from "../../../app/models/sampling";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ExpandableConfig } from "antd/lib/table/interface";
import ImageButton from "../../../app/common/button/ImageButton";
import { getExpandableConfig } from "../../report/utils";
import {
  IRouteList,
  SearchTracking,
  TrackingFormValues,
} from "../../../app/models/routeTracking";
import IconButton from "../../../app/common/button/IconButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import alerts from "../../../app/util/alerts";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import { formItemLayout } from "../../../app/util/utils";

const PendingSend = () => {
  const { procedingStore, optionStore, locationStore, samplig,routeTrackingStore } = useStore();
  const { getAll, studys, printTicket, update,exportForm,setventana } = routeTrackingStore;
  const { branchCityOptions,getBranchCityOptions } = optionStore;
  const [values, setValues] = useState<SearchTracking>(new TrackingFormValues());
  const [updateData, setUpdateDate] = useState<IUpdate[]>([]);
const [ids, setIds] = useState<number[]>([]);
const [form] = Form.useForm<SearchTracking>();
const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);
const [activiti, setActiviti] = useState<string>("");
const [expandedRowKeys,setexpandedRowKeys]= useState<string[]>([]);
const [openRows,setOpenRows]=useState<boolean>(false);
const [expandable, setExpandable] =useState<ExpandableConfig<IRouteList>>();
let navigate = useNavigate();
useEffect(()=>{
  setexpandedRowKeys(studys!.map((x)=>x.id));
  setOpenRows(true);
},[studys]);
  useEffect(() => {
    const readPriceList = async () => {
      let studios = [];
      var datas = await getAll(values!);
      getBranchCityOptions();
      console.log(datas, "daata");
      setventana("enviar");
      //setSoliCont(datas?.length!);
      datas?.forEach((x: any) => studios.push(x.studys));
      //setStudyCont(studios.length);
      //setLoading(false);
    };

    if (studys.length === 0) {
      readPriceList();
    }
    console.log(getExpandableConfig("estudios"), "config");
    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);
  const updatedata = async () => {
    var succes = await update(updateData!);
    if (succes) {
      alerts.confirm(
        "",
        `Se han enviado ${ids.length} estudios de ${solicitudesData.length} solicitud a estatus pendiente de manera exitosa `,
        async () => {
          await getAll(values);
        }
      );
      setIds([]);
      SetSolicitudesData([]);
    } else {
    }
  };
  const onExpand = (isExpanded: boolean, record: IRouteList) => {
    let expandRows: string[] = expandedRowKeys;
    if (isExpanded) {
      expandRows.push(record.id);
    } else {
      const index = expandRows.findIndex((x) => x === record.id);
      if (index > -1) {
        expandRows.splice(index, 1);
      }
    }
    setexpandedRowKeys(expandRows);
  };

  const togleRows = () => {
    if (openRows) {
      setOpenRows(false);
      setexpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setexpandedRowKeys(studys!.map((x) => x.id));
    }
  };
  const onChange = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
    var data = ids;
    var solis = solicitudesData;
    if (e.target.checked) {
      data.push(id);
      setIds(data);
      let temp = solicitudesData.filter((x) => x == solicitud);
      if (temp.length <= 0) {
        solis.push(solicitud);
        SetSolicitudesData(solis);
      }
    } else {
      if (data.length > 0) {
        var temp = data.filter((x) => x != id);
        var temps = solis.filter((x) => x != solicitud);
        setIds(temp);
        //SetSolicitudesData();
      }
    }
    var datos: IUpdate = {
      estudioId: ids,
      solicitudId: solicitud,
    };
    setUpdateDate((prev) => [...prev!, datos]);
  };
  const expandableStudyConfig = {
    expandedRowRender: (item: IRouteList) => (
      <div>
        <h4>Estudios</h4>
        {item.estudios.map((x) => {
          return (
            <>
              <Descriptions
                size="small"
                bordered
                layout="vertical"
                style={{ marginBottom: 5 }}
                column={6}
              >
                <Descriptions.Item
                  label="Clave"
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.clave}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estudio"
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.nombre}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estatus"
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.status == 1 ? "Pendiente" : "Toma de muestra"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Registro"
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.registro}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Entrega"
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.entrega}
                </Descriptions.Item>
                <Descriptions.Item
                  label=""
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
                  {x.status == 1 && (
                    <Checkbox
                      onChange={(e) => {
                        onChange(e, x.id, item.id);
                      }}
                    >
                      Selecciona
                    </Checkbox>
                  )}
                  {x.status == 2 && (
                    <Checkbox
                      onChange={(e) => {
                        onChange(e, x.id, item.id);
                      }}
                    >
                      Selecciona
                    </Checkbox>
                  )}
                  {x.status == 3 && (
                    <Checkbox
                      onChange={(e) =>   onChange(e, x.id, item.id) }
                    >
                      Selecciona
                    </Checkbox>
                  )}
                  <PrintIcon
                    key="print"
                    onClick={() => {
                      printTicket(x.expedienteid, x.solicitudid);
                    }}
                  />
                  {/* <ImageButton
                    title="Imprimir"
                    image="print"
                    onClick={() => {
                      //printTicket(item.order, item.id);
                    }}
                  ></ImageButton> */}
                </Descriptions.Item>
              </Descriptions>
            </>
          );
        })}
      </div>
    ),
    rowExpandable: () => true,
  };
  const register = () => {
    setActiviti("register");
  };
  const cancel = () => {
    setActiviti("cancel");
  };

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const hasFooterRow = true;

    const columns: IColumns<IRouteList> = [
      {
        ...getDefaultColumnProps("seguimiento", "# De seguimiento", {
          searchState,
          setSearchState,
          width: "20%",
          minWidth: 150,
        }),
        render: (value, route) => (
          <Button
            type="link"
            onClick={() => {
              navigate(`/ShipmentTracking/${route.id}`);
            }}
          >
            {value}
          </Button>
        ),
      },
        {
          ...getDefaultColumnProps("clave", "Clave de ruta", {
            searchState,
            setSearchState,
            width: "15%",
          }),
        },
        {
          ...getDefaultColumnProps("sucursal", "Sucursal", {
            searchState,
            setSearchState,
            width: "20%",
          }),
        },
        {
          ...getDefaultColumnProps("fecha", " Fecha de entrega", {
            searchState,
            setSearchState,
            width: "15%",
          }),
        },
        {
          key: "editar",
          dataIndex: "id",
          title: "Estatus",
          align: "center",
          width:  "10%",
          render: (value) => (value ? "Activo" : "Inactivo"),
        },
    
        {
          key: "editar",
          dataIndex: "id",
          title: "Editar",
          align: "center",
          width:  "10%",
          render: (value) => (
            <IconButton
              title="Editar ruta"
              icon={<EditOutlined />}
              onClick={() => {
               
              }}
            />
          ),
        },
    
        {
          key: "editar",
          dataIndex: "id",
          title: "Impresión",
          align: "center",
          width:  "10%",
          render: (value,item) => (
            <PrintIcon  
                    key="print"
                    onClick={() => {
                      printTicket(item.estudios[0].expedienteid, item.estudios[0].solicitudid);
                    }}
            />
          ),
        },
       /*  {
          key: "editar",
          dataIndex: "id",
          title: "Seleccionar",
          align: "center",
          width:  "10%",
          render: (value,item) => (
            <Checkbox  onChange={(e)=>{onChange(e,x=item.estudios.map(x=>x.),value) }} >
          
          </Checkbox>
          ),
        }, */
      ];
      const onFinish = async (newValues: SearchTracking) => {
        // setLoading(true);
     console.log("onfinish");
         const reagent = { ...values, ...newValues };


          var search= reagent;

           let studios = [];
           var datas = await getAll(search!);
          // console.log(datas, "daata");
           //setSoliCont(datas?.length!);
           datas?.forEach((x:any) => studios.push(x.pendings));
          // setStudyCont(studios.length);
           //setLoading(false);
           setExpandable(expandableStudyConfig);
         console.log(reagent,"en el onfish")
         console.log(reagent);
         let success = false;
     

     
        // setLoading(false);
     

       };
    return (
        <Fragment>
           
            <Form<SearchTracking>
                {...formItemLayout}
                form={form}
                name="reagent"
                initialValues={values}
                onFinish={onFinish}
                scrollToFirstError
              >
                <Row gutter={[0, 12]}>
                    <Col span={6}>
                        <DateRangeInput formProps={{ name: "fechas", label: "Fecha" }} ></DateRangeInput>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={4}>
                        <SelectInput options={branchCityOptions} formProps={{ name: "sucursal", label: "Sucursal" }} style={{marginLeft:"10px"}}></SelectInput>  
                    </Col>
                    <Col span={1}></Col>
                    <Col span={4}>
                        <TextInput formProps={{ name: "buscar", label: "Buscar" ,labelCol:{span:5}}} ></TextInput>
                    </Col>
                    <Col span={4}>
                    <Button style={{marginLeft:"5%"}} onClick={()=>{form.submit()}} type="primary">Buscar</Button>
                    </Col>
                    <Col> <Button style={{backgroundColor:" #18AC50"}} onClick={()=>{navigate(`/trackingOrder`);}} type="primary" >Crear orden  de seguimiento</Button></Col>
                </Row>
            </Form>
            <Row style={{marginLeft:"20%",marginBottom:"2%"}}>
                <Col span={8}>
                    <Button style={{marginTop:"8%",marginLeft:"2%"}}         type={activiti == "register" ? "primary" : "ghost"}
        onClick={register} >Enviar ruta</Button>
                    <Button style={{marginTop:"8%",marginLeft:"2%"}}  type={activiti == "cancel" ? "primary" : "ghost"}
        onClick={cancel} >Cancelar envío</Button>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                {activiti == "register" ? (
        <Button
          style={{ marginTop: "8%", marginBottom: "10px", marginLeft: "70%" }}
          type="primary"
          disabled={ids.length <= 0}
          onClick={() => {
            updatedata();
          }}
        >
          Enviar
        </Button>
      ) : (
        ""
      )}
{activiti == "cancel" ? (
        <Button
          style={{  marginTop: "8%", marginBottom: "10px", marginLeft: "70%"  }}
          type="primary"
          disabled={ids.length <= 0}
          onClick={() => {
            updatedata();
          }}
        >
          Cancelar Registro
        </Button>
      ) : (
        ""
      )}
                </Col>
            </Row>
            <Fragment >
            {studys.length > 0 &&

(

  <div style={{ textAlign: "right", marginBottom: 10 }}>

    <Button

      type="primary"

      onClick={togleRows}

      style={{ marginRight: 10 }}

    >

      {!openRows ? "Abrir tabla" : "Cerrar tabla"}

    </Button>

  </div>

)}
                <Table<IRouteList>
                loading={false}
                size="small"
                rowKey={(record) => record.id}
                columns={columns}
                pagination={false}
                dataSource={[...studys]}
                scroll={{ y: 500 }}
                //(rowClassName={(item) => (item.claveMedico == "Total" || item.paciente === "Total" ? "Resumen Total" : "")}
                expandable={{...expandable,onExpand:onExpand,expandedRowKeys:expandedRowKeys}}
                />
                <div style={{ textAlign: "right", marginTop: 10 }}>
                <Tag color="lime">
                    {!hasFooterRow ? 3 : Math.max(3 - 1, 0)}{" "}
                    Registros
                </Tag>
                </div>
            </Fragment>
        </Fragment>
    );
}
export default observer(PendingSend);
