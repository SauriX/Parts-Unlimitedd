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
  ISamplingForm,
  ISamplingList,
  IUpdate,
  SamplingFormValues,
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
  IstudyRoute,
  SearchTracking,
  TrackingFormValues,
} from "../../../app/models/routeTracking";
import IconButton from "../../../app/common/button/IconButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import alerts from "../../../app/util/alerts";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import { formItemLayout } from "../../../app/util/utils";
import { toJS } from "mobx";

const PendingSend = () => {
  const {
    procedingStore,
    optionStore,
    locationStore,
    samplingStudyStore: samplig,
    routeTrackingStore,
    profileStore,
  } = useStore();
  const { getAll, studys, printTicket, update, exportForm, setventana } =
    routeTrackingStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { profile } = profileStore;
  const [values, setValues] = useState<SearchTracking>(
    new TrackingFormValues()
  );
  const [updateData, setUpdateDate] = useState<IUpdate[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [form] = Form.useForm<SearchTracking>();
  const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);
  const [activiti, setActiviti] = useState<string>("");
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  const [expandable, setExpandable] = useState<ExpandableConfig<IRouteList>>();
  const [selectedStudies, setSelectedStudies] = useState<any[]>([
    // { solicitudId: "", estudiosId: [{ estudioId: "", tipo: 3 }] },
  ]);
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any[]>([]);
  let navigate = useNavigate();
  useEffect(() => {
    setexpandedRowKeys(studys!.map((x) => x.id));
    setOpenRows(true);
    form.setFieldsValue({ sucursal: profile?.sucursal! });
  }, [studys]);
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
    let estudios = 0;
    let solicitudes =0;
    updateData.forEach(element => {
        estudios+=element.estudioId.length;
    });
    solicitudes = updateData.length;
    

      alerts.confirm(
        "",
        `Se han enviado ${estudios} estudios de ${solicitudes} solicitud a estatus en ruta de manera exitosa `,
        async () => {
          var succes = await update(updateData!);
          if(succes){
           // await getAll(values);
            form.submit();
          }
          setUpdateDate([]);
        }
      );

    
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
      ruteOrder: solicitud,
      solicitudId:solicitud
    };
    setUpdateDate((prev) => [...prev!, datos]);
  };
  const columnsStudy: IColumns<IstudyRoute> = [
    {
      ...getDefaultColumnProps("clave", "Solicitud", {
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
      ...getDefaultColumnProps("nombre", "Estudio", {
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("entrega", "Entrega", {
        width: "15%",
      }),
    },
  ];
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
                  label=""
                  className="description-content"
                  style={{ maxWidth: 30 }}
                >
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
    setUpdateDate([]);
  };
  const cancel = () => {
    setActiviti("cancel");
    setUpdateDate([]);  
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
      width: "10%",
      render: (value) => (value ? "Activo" : "Inactivo"),
    },

    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (value) => (
        <IconButton
          title="Editar ruta"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/trackingOrder/${value}`);
          }}
        />
      ),
    },

    {
      key: "editar",
      dataIndex: "id",
      title: "Impresión",
      align: "center",
      width: "10%",
      render: (value, item) => (
        <PrintIcon
          key="print"
          onClick={() => {
            console.log(item.id);
            exportForm(item.id);
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

    var search = reagent;

    let studios = [];
    var datas = await getAll(search!);
    // console.log(datas, "daata");
    //setSoliCont(datas?.length!);
    datas?.forEach((x: any) => studios.push(x.pendings));
    // setStudyCont(studios.length);
    //setLoading(false);
    setExpandable(expandableStudyConfig);
    console.log(reagent, "en el onfish");
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
            <DateRangeInput
              formProps={{ name: "fechas", label: "Fecha" }}
            ></DateRangeInput>
          </Col>
          <Col span={1}></Col>
          <Col span={4}>
            <SelectInput
              options={branchCityOptions}
              formProps={{ name: "sucursal", label: "Sucursal" }}
              style={{ marginLeft: "10px" }}
            ></SelectInput>
          </Col>
          <Col span={1}></Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "buscar",
                label: "Buscar",
                labelCol: { span: 5 },
              }}
            ></TextInput>
          </Col>
          <Col span={4}>
            <Button
              style={{ marginLeft: "5%" }}
              onClick={() => {
                form.submit();
              }}
              type="primary"
            >
              Buscar
            </Button>
          </Col>
          <Col>
            {" "}
            <Button
              style={{ backgroundColor: " #18AC50" }}
              onClick={() => {
                navigate(`/trackingOrder/new`);
              }}
              type="primary"
            >
              Crear orden de seguimiento
            </Button>
          </Col>
        </Row>
      </Form>
      <Row style={{ marginBottom: "1%", marginTop:"2%" }}>
        <Col span={8}>
          <Button
            
            type={activiti == "register" ? "primary" : "ghost"}
            onClick={register}
          >
            Enviar ruta
          </Button>
          <Button
            
            type={activiti == "cancel" ? "primary" : "ghost"}
            onClick={cancel}
          >
            Cancelar envío
          </Button>
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          {activiti == "register" ? (
            <Button

              type="primary"
              disabled={updateData.length <= 0}
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

              type="primary"
              disabled={updateData.length <= 0}
              onClick={() => {
                updatedata();
              }}
            >
              Cancelar Registro
            </Button>
          ) : (
            ""
          )}
          </div>
        </Col>
      </Row>
      <Fragment>
        {studys.length > 0 && (
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
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={[...studys]}
          rowClassName="row-search"
          // pagination={false}
          // scroll={{ x: 450 }}

          expandable={{
            onExpand: onExpand,
            expandedRowKeys: expandedRowKeys,
            rowExpandable: () => true,
            defaultExpandAllRows: true,

            expandedRowRender: (datos: IRouteList, index: number) => (
              <>
               
                <Table
                  size="small"
                  rowKey={(record) => record.id}
                  columns={columnsStudy}
                  dataSource={[...datos.estudios]}
                  bordered
                  style={{}}
                  className="header-expandable-table"
                  pagination={false}
                  showHeader={index === 0}
                  rowSelection={{
                    type: "checkbox",
                    getCheckboxProps: (record: any) => ({
                      disabled:
                        (activiti != "register" && activiti != "cancel") ||
                        (activiti == "register" && record.status != 2) ||
                        (activiti == "cancel" && record.status != 8),
                    }),
                    onSelect: (selectedRow, isSelected, a: any) => {
                      
                      var data = ids;
                      var solis = solicitudesData;
                      var dataid: number[] = [];
                      var dataupdate = updateData;
                      if (isSelected) {
                        data.push(selectedRow.id);
                        dataid.push(selectedRow.id);
                        setIds(data);
                        let temp = solicitudesData.filter((x) => x == selectedRow.solicitudid );
                        let temp2 = dataupdate!.filter((x) => x.solicitudId ==selectedRow.solicitudid);
                        if (temp2.length <= 0) {
                          let datatoupdate: IUpdate = {
                            solicitudId: selectedRow.solicitudid,
                            estudioId: dataid,
                          };
                          dataupdate?.push(datatoupdate);
                        } else {
                          let solicitudtoupdate = dataupdate?.filter(
                            (x) => x.solicitudId == selectedRow.solicitudid
                          )[0];
                          let count = solicitudtoupdate?.estudioId!.filter((x) => x == selectedRow.id);
                          if (count!.length <= 0) {
                            solicitudtoupdate?.estudioId.push(selectedRow.id);
                            let indexsoli = dataupdate?.findIndex(
                              (x) => x.solicitudId == selectedRow.solicitudid
                            );
                            dataupdate[indexsoli!] = solicitudtoupdate;
                          }
                        }
                        if (temp.length <= 0) {
                          solis.push(selectedRow.solicitudid);
                          SetSolicitudesData(solis);
                        }
                      } else {
                        if (data.length > 0) {
                          var temp = data.filter((x) => x != selectedRow.id);
                          var temps = solis.filter((x) => x != selectedRow.solicitudid);
                          setIds(temp);
                          //SetSolicitudesData();
                        }
                        let solicitudtoupdate = dataupdate?.filter(
                          (x) => x.solicitudId == selectedRow.solicitudid
                        )[0];
                        if (solicitudtoupdate.estudioId.length == 1) {
                          dataupdate = dataupdate.filter((x) => x.solicitudId != selectedRow.solicitudid);
                        } else {
                          let count = solicitudtoupdate?.estudioId!.filter((x) => x == selectedRow.id);
                          if (count!.length > 0) {
                            let estudios = solicitudtoupdate?.estudioId.filter((x) => x !=selectedRow.id);
                            solicitudtoupdate.estudioId = estudios;
                            let indexsoli = dataupdate?.findIndex(
                              (x) => x.solicitudId == selectedRow.solicitudid
                            );
                            dataupdate[indexsoli!] = solicitudtoupdate;
                          }
                        }
                      }
                  
                      setUpdateDate(dataupdate);
    
                    },
                    onChange: (
                      selectedRowKeys: React.Key[],
                      selectedRows: any,
                      rowSelectedMethod: any
                    ) => {
                      console.log("a", toJS(rowSelectedMethod));
                      if (rowSelectedMethod.type === "all") {
                        if (selectedRowKeys.length > 0) {
                          console.log(
                            "selected row keys",
                            toJS(selectedRowKeys)
                          );
                          console.log("a", toJS(rowSelectedMethod));
                          let existingStudy = null;
                          if (updateData.length > 0) {
                            setUpdateDate([]);
                          } else {
                            var listuopdate: IUpdate[] = [];
                            
                            console.log(studys);
                            studys.forEach(datas=>{
                              let studylist: number[] = [];
                              datas.estudios.forEach((study) => {
                                
                                if (
                                  (activiti == "register" && study.status == 2) ||
                                  (activiti == "cancel" && study.status == 8)
                                ) {
  
                                  studylist.push(study.id);
                                }
                              });
                              var datatoupdate: IUpdate = {
                                ruteOrder: datos.id,
                                estudioId: studylist,
                                solicitudId:datos.id
                              };
                              listuopdate.push(datatoupdate);
                            })
                            console.log(listuopdate,"lista");
                            setUpdateDate(listuopdate);
                          }
                        }else{
                          setUpdateDate([]);
                        }
                      }
                      /*                      
                      setSelectedRowKeysCheck(selectedRowKeys);
                      console.log("selectedt rows", toJS(selectedRows));
                      console.log("a", toJS(rowSelectedMethod));
                      let newStudies: any[] = [];
                      
                        if (selectedRowKeys.length > 0) {
                          let existRequest = null;

                          let newResquestStudies = {
                            solicitudId: data.id,
                            estudiosId: [] as any[],
                          };
                           selectedRowKeys.forEach((key) => {
                            existRequest = selectedStudies.find(
                              (study) => study.routeId === data.id
                            );
                            if (!existRequest) {
                              const newStudy: any = {
                                estudioId: key,
                                tipo: selectedRows[0].isPathological ? 30 : -1,
                              };
                              newResquestStudies.estudiosId.push(newStudy);
                            }
                          });
                          if (!existRequest) {
                            newStudies.push(newResquestStudies);
                          }
                          setSelectedStudies([
                            ...selectedStudies,
                            ...newStudies,
                          ]); 
                      } else {
                           const newStudies = selectedStudies.filter(
                            (study) => study.routeId !== data.id
                          ); 

                           setSelectedStudies(newStudies); 
                        }
                      } */
                      
                    },
                    selectedRowKeys: updateData.find(
                      (x) => x.ruteOrder == datos.id
                    )?.estudioId,
                  }}
                ></Table>
              </>
            ),
          }}
          bordered
        ></Table>
      </Fragment>
    </Fragment>
  );
};
export default observer(PendingSend);
