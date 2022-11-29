import "./css/changeStatus.less";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Form,
  Input,
  Row,
  Table,
  Tag,
} from "antd";
import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import moment from "moment";
import useWindowDimensions from "../../app/util/window";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  IsamplingForm,
  IsamplingList,
  IUpdate,
  samplingFormValues,
} from "../../app/models/sampling";
import { formItemLayout } from "../../app/util/utils";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { getExpandableConfig } from "../report/utils";
import { ExpandableConfig } from "antd/lib/table/interface";
import ImageButton from "../../app/common/button/ImageButton";
import { originOptions, urgencyOptions } from "../../app/stores/optionStore";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import alerts from "../../app/util/alerts";
import PrintIcon from "../../app/common/icons/PrintIcon";
import SamplinTableStudy from "./SamplinTableStudy";
import SamplingStudyColumns, {
  SamplingStudyExpandable,
} from "./SamplingStudyTable";
import { IOptions } from "../../app/models/shared";
import { toJS } from "mobx";

const { Panel } = Collapse;
type ProceedingTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const SamplingTable: FC<ProceedingTableProps> = ({
  componentRef,
  printing,
}) => {
  const { procedingStore, optionStore, locationStore, samplig } = useStore();
  const { expedientes, getnow, setSearch } = procedingStore;
  const {
    branchCityOptions,
    getBranchCityOptions,
    areas,
    getareaOptions,
    medicOptions,
    getMedicOptions,
    CityOptions,
    getCityOptions,
    departmentOptions,
    getDepartmentOptions,
    companyOptions,
    getCompanyOptions,
    departmentAreaOptions,
    getDepartmentAreaOptions,
  } = optionStore;
  const {
    getAll,
    studys,
    printTicket,
    update,
    setSoliCont,
    setStudyCont,
    soliCont,
    studyCont,
    search,
  } = samplig;
  const { getCity } = locationStore;
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<IsamplingForm>();
  const selectedCity: any = Form.useWatch("ciudad", form);
  let navigate = useNavigate();
  const [values, setValues] = useState<IsamplingForm>(new samplingFormValues());
  const [updateData, setUpdateData] = useState<IUpdate[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);
  const { width: windowWidth } = useWindowDimensions();
  const [expandable, setExpandable] =
    useState<ExpandableConfig<IsamplingList>>();
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<any>([]);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const hasFooterRow = true;
  const [activar, setActivar] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [activiti, setActiviti] = useState<string>("");
  const [openRows, setOpenRows] = useState<boolean>(false);
  const areaSelected = Form.useWatch(["departamento"], form);
  //const [search,SetSearch] = useState<ISearchMedical>(new SearchMedicalFormValues())
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const togleRows = () => {
    console.log("togle");
    if (openRows) {
      setOpenRows(false);
      setexpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setexpandedRowKeys(studys!.map((x) => x.id));
    }
  };
  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);
  useEffect(() => {
    setBranchOptions(
      branchCityOptions.find((x) => x.value === selectedCity)?.options ?? []
    );
    form.setFieldValue("sucursalId", []);
  }, [branchCityOptions, form, selectedCity]);
  useEffect(() => {
    setexpandedRowKeys(studys!.map((x) => x.id));
    setOpenRows(true);
  }, [studys]);

  const onChange = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
    console.log("onchange");
    var data = ids;
    var solis = solicitudesData;
    var dataid: number[] = [];
    var dataupdate = updateData;
    if (e.target.checked) {
      data.push(id);
      dataid.push(id);
      setIds(data);
      let temp = solicitudesData.filter((x) => x == solicitud);
      let temp2 = dataupdate!.filter((x) => x.solicitudId == solicitud);
      if (temp2.length <= 0) {
        let datatoupdate: IUpdate = {
          solicitudId: solicitud,
          estudioId: dataid,
        };
        dataupdate?.push(datatoupdate);
      } else {
        let solicitudtoupdate = dataupdate?.filter(
          (x) => x.solicitudId == solicitud
        )[0];
        let count = solicitudtoupdate?.estudioId!.filter((x) => x == id);
        if (count!.length <= 0) {
          solicitudtoupdate?.estudioId.push(id);
          let indexsoli = dataupdate?.findIndex(
            (x) => x.solicitudId == solicitud
          );
          dataupdate[indexsoli!] = solicitudtoupdate;
        }
      }
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
      let soliAux = dataupdate?.find((x) => x.solicitudId == solicitud);

      if (!!soliAux) {
        let tempAux = soliAux.estudioId.filter((x) => x != id);
        soliAux.estudioId = tempAux;
        let index = dataupdate?.findIndex((x) => x.solicitudId == solicitud);
        dataupdate[index!] = soliAux;
      }

      if (dataupdate.some((x) => x.estudioId.length === 0)) {
        dataupdate = dataupdate.filter((x) => x.estudioId.length !== 0);
        // setUpdateDate(temp);
      }
      // let solicitudtoupdate = dataupdate?.filter(
      //   (x) => x.solicitudId == solicitud
      // )[0];
      // if (!!solicitudtoupdate) {
      //   if (solicitudtoupdate.estudioId.length == 1) {
      //     dataupdate = dataupdate.filter((x) => x.solicitudId != solicitud);
      //   } else {
      //     let count = solicitudtoupdate?.estudioId!.filter((x) => x == id);
      //     if (count!.length > 0) {
      //       let estudios = solicitudtoupdate?.estudioId.filter((x) => x != id);
      //       solicitudtoupdate.estudioId = estudios;
      //       let indexsoli = dataupdate?.findIndex(
      //         (x) => x.solicitudId == solicitud
      //       );
      //       dataupdate[indexsoli!] = solicitudtoupdate;
      //     }
      //   }
      // }
    }
    console.log("dataupdate", dataupdate);
    if (dataupdate.length <= 0) {
      console.log("if");
      setActivar(false);
    } else {
      console.log("else");
      setActivar(true);
    }

    setUpdateData(dataupdate);
  };
  const updatedata = async () => {
    setLoading(true);
    var succes = await update(updateData!);
    if (succes) {
      setLoading(false);
      alerts.confirmInfo(
        "",
        `Se ha(n) enviado ${ids.length} estudio(s) de ${solicitudesData.length} solicitud(es) a estatus de toma de muestra de manera exitosa `,
        async () => {
          await getAll(search);
          // await getAll(values);
          setIds([]);
          SetSolicitudesData([]);
          setActivar(false);
          setUpdateData([]);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const expandableStudyConfig = {
    expandedRowRender: (item: IsamplingList) => (
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
                column={7}
              >
                <Descriptions.Item
                  label="Clave"
                  style={{ maxWidth: 30, color: "#000000" }}
                >
                  {x.clave}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estudio"
                  style={{ maxWidth: 30, color: "#000000" }}
                >
                  {x.nombre}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estatus"
                  style={{ maxWidth: 30, color: "#000000" }}
                >
                  {x.estatus == 1 ? "Pendiente" : "Toma de muestra"}
                </Descriptions.Item>
                <Descriptions.Item label="Registro" style={{ maxWidth: 30 }}>
                  {x.registro}
                </Descriptions.Item>
                <Descriptions.Item label="Entrega" style={{ maxWidth: 30 }}>
                  {x.entrega}
                </Descriptions.Item>
                <Descriptions.Item label="" style={{ maxWidth: 30 }}>
                  {x.estatus == 1 && activiti == "register" && (
                    <Checkbox onChange={(e) => onChange(e, x.id, item.id)}>
                      Selecciona
                    </Checkbox>
                  )}
                  {x.estatus == 2 && activiti == "cancel" && (
                    <Checkbox onChange={(e) => onChange(e, x.id, item.id)}>
                      Selecciona
                    </Checkbox>
                  )}
                  <PrintIcon
                    key="print"
                    onClick={() => {
                      printTicket(item.order, item.id);
                    }}
                  />
                </Descriptions.Item>
              </Descriptions>
            </>
          );
        })}
      </div>
    ),
    rowExpandable: () => true,
  };

  useEffect(() => {
    const readData = async () => {
      await getBranchCityOptions();
      await getareaOptions(0);
      await getMedicOptions();
      await getCityOptions();
      await getDepartmentOptions();
      await getCompanyOptions();
      await getDepartmentAreaOptions();
    };

    readData();
  }, [getBranchCityOptions]);

  useEffect(() => {
    console.log("here");
    const readPriceList = async () => {
      setLoading(true);
      let studios = [];
      var datas = await getAll(values!);

      console.log(datas, "daata");
      setSoliCont(datas?.length!);
      datas?.forEach((x) =>
        x.estudios.forEach((x: any) => {
          studios.push(x);
        })
      );
      setStudyCont(studios.length);
      setLoading(false);
    };

    if (expedientes.length === 0) {
      readPriceList();
    }
    console.log(expandableStudyConfig, "config");
    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);
  const onExpand = (isExpanded: boolean, record: IsamplingList) => {
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
  useEffect(() => {
    console.log(activiti, "useffect");
    setExpandable(expandableStudyConfig);
  }, [activiti]);
  const onFinish = async (newValues: IsamplingForm) => {
    setLoading(true);
    let studios = [];
    const reagent = { ...values, ...newValues };
    var data = await getAll(reagent);
    console.log(data, "daata");
    setSoliCont(data?.length!);
    data?.forEach((x) =>
      x.estudios.forEach((x: any) => {
        studios.push(x);
      })
    );
    setStudyCont(studios.length);
    console.log(data, "datas");
    setLoading(false);
  };

  const register = () => {
    setActiviti("register");
  };
  const cancel = () => {
    setActiviti("cancel");
  };

  useEffect(() => {
    getAll({
      fecha: [
        moment(Date.now()).utcOffset(0, true),
        moment(Date.now()).utcOffset(0, true),
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IsamplingList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },

    {
      ...getDefaultColumnProps("compañia", "Compañia", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
  ];

  /*   const PriceListTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Lista de Expedientes"  />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IProceedingList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 7)}
          pagination={false}
          dataSource={[...expedientes]}
        />
      </div>
    );
  }; */

  return (
    <Fragment>
      <div style={{ marginBottom: "5px", marginLeft: "90%" }}>
        <Button
          key="clean"
          onClick={(e) => {
            e.stopPropagation();

            form.resetFields();
          }}
          style={{ marginLeft: "10%" }}
        >
          Limpiar
        </Button>
        <Button
          key="filter"
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            form.submit();
          }}
          style={{ marginLeft: "10%" }}
        >
          Filtrar
        </Button>
      </div>
      <div
        className="status-container"
        style={{
          // backgroundColor: "#F2F2F2",
          height: "auto",
          borderStyle: "solid",
          borderColor: "#CBC9C9",
          borderWidth: "1px",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <Form<IsamplingForm>
          {...formItemLayout}
          form={form}
          name="sampling"
          initialValues={values}
          onFinish={onFinish}
          scrollToFirstError
          onValuesChange={(changedValues, allValues) => {
            const changesKyes = Object.keys(changedValues);
            if (changesKyes.includes("departamento")) {
              const selectedDepatements: ReactNode[] = departmentOptions
                .filter((x) => changedValues.departamento.includes(x.value))
                .map((x) => x.label);
              const filterAreas = departmentAreaOptions
                .filter((x) => selectedDepatements.includes(x.value))
                .map((x) => x.options)
                .flatMap((x) => x);
              setFilteredAreas(filterAreas);
            }
            console.log("values change", changedValues, allValues);
          }}
        >
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[12, 12]}>
                <Col span={8}>
                  <DateRangeInput
                    formProps={{ label: "Fecha", name: "fecha" }}
                    disableAfterDates
                  />
                </Col>
                <Col span={8}>
                  <TextInput
                    formProps={{
                      name: "buscar",
                      label: "Buscar",
                    }}
                  />
                </Col>
                {/* <Col span={8} style={{ textAlign: "right" }}> */}
                {/*                   <Button
                    type="primary"
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    Buscar
                  </Button> */}
                {/* </Col> */}
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "procedencia",
                      label: "Procedencia",
                    }}
                    multiple
                    options={originOptions}
                  ></SelectInput>
                </Col>

                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "estatus",
                      label: "Estatus",
                    }}
                    multiple
                    options={[
                      { value: 1, label: "Pendiente" },
                      { value: 2, label: "Toma" },
                    ]}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "departamento",
                      label: "Departamento",
                    }}
                    multiple
                    options={departmentOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "area",
                      label: "Área",
                    }}
                    multiple
                    // options={areas}
                    options={filteredAreas ?? []}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "medico",
                      label: "Médico",
                    }}
                    multiple
                    options={medicOptions}
                  ></SelectInput>
                </Col>
                <Col span={8}>
                  {/* <SelectInput
                    formProps={{ name: "sucursalId", label: "Sucursales" }}
                    multiple
                    options={branchCityOptions}
                  /> */}
                  <Form.Item label="Sucursal" className="no-error-text" help="">
                    <Input.Group>
                      <Row gutter={8}>
                        <Col span={12}>
                          <SelectInput
                            formProps={{
                              name: "ciudad",
                              label: "Ciudad",
                              noStyle: true,
                            }}
                            options={cityOptions}
                          />
                        </Col>
                        <Col span={12}>
                          <SelectInput
                            formProps={{
                              name: "sucursalId",
                              label: "Sucursales",
                              noStyle: true,
                            }}
                            multiple
                            options={branchOptions}
                          />
                        </Col>
                      </Row>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "compañia",
                      label: "Compañía",
                    }}
                    multiple
                    options={companyOptions}
                  ></SelectInput>
                </Col>
                {/* <Col span={8}></Col> */}
                <Col span={8}>
                  <SelectInput
                    formProps={{
                      name: "tipoSolicitud",
                      label: "Tipo solicitud",
                    }}
                    multiple
                    options={urgencyOptions}
                  ></SelectInput>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
      <Row>
        <Col md={8}>
          <Button
            style={{ marginTop: "10px", marginBottom: "10px" }}
            type={activiti == "register" ? "primary" : "ghost"}
            onClick={register}
          >
            Registrar Toma
          </Button>
          <Button
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
            type={activiti == "cancel" ? "primary" : "ghost"}
            onClick={cancel}
          >
            Cancelar Registro
          </Button>
        </Col>
        <Col md={13}></Col>
        <Col md={3}>
          {activiti == "register" ? (
            <Button
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                marginLeft: "34%",
              }}
              type="primary"
              disabled={!activar}
              onClick={() => {
                updatedata();
              }}
            >
              {activar ? "" : " "}
              Aceptar Registro
            </Button>
          ) : (
            ""
          )}
          {activiti == "cancel" ? (
            <Button
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                marginLeft: "30%",
              }}
              type="primary"
              disabled={!activar}
              onClick={() => {
                updatedata();
              }}
            >
              {activar ? "" : " "}
              Cancelar Registro
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>

      <Fragment>
        <SamplinTableStudy
          data={studys}
          columns={SamplingStudyColumns({ printTicket })}
          expandable={SamplingStudyExpandable({
            activiti,
            onChange,
          })}
        />
      </Fragment>
    </Fragment>
  );
};

export default observer(SamplingTable);
