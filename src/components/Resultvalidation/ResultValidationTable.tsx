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
  Spin,
} from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import { ISearch } from "../../app/common/table/utils";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { IUpdate } from "../../app/models/sampling";
import { formItemLayout } from "../../app/util/utils";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { ExpandableConfig } from "antd/lib/table/interface";
import { urgencyOptions } from "../../app/stores/optionStore";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import alerts from "../../app/util/alerts";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { Ivalidationlist } from "../../app/models/resultValidation";
import moment from "moment";
import ValidationTableStudy from "./ValidationTableStudy";
import ValidationStudyColumns, {
  ValidationStudyExpandable,
} from "./ValidationStudyTable";
import { IOptions } from "../../app/models/shared";
import { checked } from "../../app/models/relaseresult";
import { IGeneralForm } from "../../app/models/general";

type ProceedingTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const ResultValidationTable: FC<ProceedingTableProps> = ({
  componentRef,
  printing,
}) => {
  const {
    procedingStore,
    optionStore,
    resultValidationStore,
    profileStore,
    generalStore,
  } = useStore();
  const { profile } = profileStore;
  const { expedientes } = procedingStore;
  const {
    branchCityOptions,
    medicOptions,
    getMedicOptions,
    companyOptions,
    getCompanyOptions,
    studiesOptions,
    getStudiesOptions,
    areaByDeparmentOptions,
    getAreaByDeparmentOptions,
  } = optionStore;
  const {
    getAll,
    studys,
    printTicket,
    update,
    setSoliCont,
    setStudyCont,
    viewTicket,
  } = resultValidationStore;
  const { generalFilter, setGeneralFilter } = generalStore;

  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);
  const [form] = Form.useForm<IGeneralForm>();

  const [updateData, setUpdateDate] = useState<IUpdate[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);

  const [expandable, setExpandable] =
    useState<ExpandableConfig<Ivalidationlist>>();
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const [visto, setvisto] = useState<checked[]>([]);
  const [activar, setActivar] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [activiti, setActiviti] = useState<string>("");
  const [openRows, setOpenRows] = useState<boolean>(false);

  const selectedDepartment = Form.useWatch("departamento", form);
  const selectedCity = Form.useWatch("ciudad", form);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getMedicOptions();
    getCompanyOptions();
    getAreaByDeparmentOptions();
  }, [getMedicOptions, getCompanyOptions, getAreaByDeparmentOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    if (!profile || !profile.sucursal || branchCityOptions.length === 0) return;
    const profileBranch = profile.sucursal;
    const userCity = branchCityOptions
      .find((x) => x.options!.some((y) => y.value === profileBranch))
      ?.value?.toString();

    const filter = {
      ...generalFilter,
      ciudad: !generalFilter.cargaInicial
        ? generalFilter.ciudad
        : [userCity as string],
      sucursalId: !generalFilter.cargaInicial
        ? generalFilter.sucursalId
        : [profileBranch],
    };
    form.setFieldsValue(filter);
    filter.cargaInicial = false;

    setGeneralFilter(filter);
    getAll(filter);
  }, [branchCityOptions]);

  useEffect(() => {
    if (selectedCity != undefined && selectedCity != null) {
      var branches = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branches.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
    }
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    setDepartmentOptions(
      areaByDeparmentOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [areaByDeparmentOptions]);

  useEffect(() => {
    setAreaOptions(
      areaByDeparmentOptions.find((x) =>
        selectedDepartment?.includes(x.value as string)
      )?.options ?? []
    );
  }, [areaByDeparmentOptions, form, selectedDepartment]);

  useEffect(() => {
    const readStudy = async () => {
      await getStudiesOptions();
    };
    readStudy();
  }, [getStudiesOptions]);

  useEffect(() => {
    setexpandedRowKeys(studys?.map((x) => x.id) ?? []);
    setOpenRows(true);
  }, [studys]);

  const onChange = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
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
      let solicitudtoupdate = dataupdate?.filter(
        (x) => x.solicitudId == solicitud
      )[0];
      if (solicitudtoupdate.estudioId.length == 1) {
        dataupdate = dataupdate.filter((x) => x.solicitudId != solicitud);
      } else {
        let count = solicitudtoupdate?.estudioId!.filter((x) => x == id);
        if (count!.length > 0) {
          let estudios = solicitudtoupdate?.estudioId.filter((x) => x != id);
          solicitudtoupdate.estudioId = estudios;
          let indexsoli = dataupdate?.findIndex(
            (x) => x.solicitudId == solicitud
          );
          dataupdate[indexsoli!] = solicitudtoupdate;
        }
      }
    }

    if (dataupdate.length <= 0) {
      setActivar(false);
    } else {
      setActivar(true);
    }

    setUpdateDate(dataupdate);
  };
  const alerta = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
    alerts.confirm(
      "",
      `“Al liberar este estudio se realizará el envío automático por lo cual no puede cancelarse su liberación, ¿Esta de acuerdo con la liberación?`,
      async () => {
        onChange(e, id, solicitud);
      },
      () => {}
    );
  };
  const verfiy = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
    let request = studys.find((x) => x.solicitud === solicitud);
    let updatedata = updateData.find((x) => x.solicitudId === request?.id);
    let totalStudios = request?.estudios.length;
    let estudiosxliberar = request?.estudios.filter(
      (x) => x.estatus !== 4 && x.estatus !== 7
    ).length;
    if (activiti == "cancel") {
      onChange(e, id, solicitud);
    } else {
      if (updatedata != null || updatedata != undefined) {
        if (updatedata?.estudioId.length + 1 === totalStudios) {
          alerta(e, id, solicitud);
        } else {
          if (estudiosxliberar === updatedata?.estudioId.length + 1) {
            alerta(e, id, solicitud);
          } else {
            onChange(e, id, solicitud);
          }
        }
      } else {
        if (totalStudios === 1) {
          alerta(e, id, solicitud);
        } else {
          onChange(e, id, solicitud);
        }
      }
    }
  };

  const updatedata = async () => {
    setLoading(true);

    setLoading(false);
    alerts.confirm(
      "",
      `Se ha(n) enviado ${ids.length} estudio(s) de ${
        solicitudesData.length
      } solicitud(es) a estatus ${
        activiti == "register" ? "validado" : "capturado"
      } de manera exitosa `,
      async () => {
        var succes = await update(updateData!);
        if (succes) {
          await getAll(generalFilter);
          setUpdateDate([]);
          setIds([]);
          setActivar(false);
          SetSolicitudesData([]);
        } else {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      }
    );
    setIds([]);
    SetSolicitudesData([]);
  };

  const expandableStudyConfig = {
    expandedRowRender: (item: Ivalidationlist) => (
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
                  label="Estudio"
                  style={{ maxWidth: 30, color: "#000000" }}
                >
                  {x.study}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estatus"
                  style={{ maxWidth: 30, color: "#000000" }}
                >
                  {x.status == "1" ? "Pendiente" : "Toma de muestra"}
                </Descriptions.Item>
                <Descriptions.Item label="Registro" style={{ maxWidth: 30 }}>
                  {moment(x.registro).format("DD/MM/YYYY-h:mmA")}
                </Descriptions.Item>
                <Descriptions.Item label="Entrega" style={{ maxWidth: 30 }}>
                  {moment(x.entrega).format("DD/MM/YYYY-h:mmA")}
                </Descriptions.Item>
                <Descriptions.Item label="" style={{ maxWidth: 30 }}>
                  {x.status == "4" && activiti == "register" && (
                    <Checkbox onChange={(e) => onChange(e, x.id, item.id)}>
                      Selecciona
                    </Checkbox>
                  )}
                  {x.status == "5" && activiti == "cancel" && (
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
    const readPriceList = async () => {
      setLoading(true);
      let studios = [];
      var datas = await getAll(generalFilter);

      setSoliCont(datas?.length!);
      datas?.forEach((x) =>
        x.estudios.forEach((x: any) => {
          studios.push(x);
        })
      );
      setStudyCont(studios.length);
      setStudyCont(studios.length);
      setLoading(false);
    };

    if (expedientes.length === 0) {
      readPriceList();
    }

    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);

  useEffect(() => {
    setExpandable(expandableStudyConfig);
  }, [activiti]);

  const onFinish = async (newValues: IGeneralForm) => {
    setLoading(true);

    const searchValidation = { ...generalFilter, ...newValues };
    setGeneralFilter(searchValidation);
    var data = await getAll(searchValidation);
    let studios = [];

    setSoliCont(data?.length!);
    data?.forEach((x) =>
      x.estudios.forEach((x: any) => {
        studios.push(x);
      })
    );
    setStudyCont(studios.length);
    setLoading(false);
  };

  const register = () => {
    setActiviti("register");
    setUpdateDate([]);
    setIds([]);
    setActivar(false);
  };
  const cancel = () => {
    setActiviti("cancel");
    setUpdateDate([]);
    setIds([]);
    setActivar(false);
  };

  return (
    <Fragment>
      <Spin spinning={loading} tip={printing ? "Imprimiendo" : ""}>
        <div className="status-container">
          <Form<IGeneralForm>
            {...formItemLayout}
            form={form}
            name="validation"
            initialValues={{
              fecha: [
                moment(Date.now()).utcOffset(0, true),
                moment(Date.now()).utcOffset(0, true),
              ],
            }}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row justify="space-between" gutter={[0, 12]}>
              <Col span={8}>
                <DateRangeInput formProps={{ label: "Fecha", name: "fecha" }} />
              </Col>
              <Col span={8}>
                <TextInput
                  formProps={{
                    name: "buscar",
                    label: "Buscar",
                  }}
                  autoFocus
                />
              </Col>
              <Col span={8}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "tipoSolicitud",
                    label: "Tipo solicitud",
                  }}
                  multiple
                  options={urgencyOptions}
                ></SelectInput>
              </Col>
              <Col span={8}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "estudio",
                    label: "Estudios",
                  }}
                  multiple
                  options={studiesOptions}
                ></SelectInput>
              </Col>
              <Col span={8}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "estatus",
                    label: "Estatus",
                  }}
                  multiple
                  options={[
                    { value: 5, label: "Validado" },
                    { value: 4, label: "Capturado" },
                    { value: 7, label: "Enviado" },
                  ]}
                ></SelectInput>
              </Col>
              <Col span={8}>
                <Form.Item label="Áreas" className="no-error-text" help="">
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <SelectInput
                         form={form}
                          formProps={{
                            name: "departamento",
                            label: "Departamento",
                            noStyle: true,
                          }}
                          multiple
                          options={departmentOptions}
                        />
                      </Col>
                      <Col span={12}>
                        <SelectInput
                         form={form}
                          formProps={{
                            name: "area",
                            label: "Área",
                            noStyle: true,
                          }}
                          multiple
                          options={areaOptions}
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "medicoId",
                    label: "Médico",
                  }}
                  multiple
                  options={medicOptions}
                ></SelectInput>
              </Col>
              <Col span={8}>
                <Form.Item label="Sucursal" className="no-error-text" help="">
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <SelectInput
                          form={form}
                          formProps={{
                            name: "ciudad",
                            label: "Ciudad",
                            noStyle: true,
                          }}
                          multiple
                          options={cityOptions}
                        />
                      </Col>
                      <Col span={12}>
                        <SelectInput
                          form={form}
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
                  form={form}
                  formProps={{
                    name: "compañiaId",
                    label: "Compañía",
                  }}
                  multiple
                  options={companyOptions}
                ></SelectInput>
              </Col>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button key="clean" htmlType="reset">
                  Limpiar
                </Button>
                <Button key="filter" type="primary" htmlType="submit">
                  Buscar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Row>
          <Col md={8}>
            <Button
              style={{ marginTop: "5px", marginBottom: "10px" }}
              type={activiti == "register" ? "primary" : "ghost"}
              onClick={register}
            >
              Registrar Validación
            </Button>
            <Button
              style={{
                marginTop: "5px",
                marginBottom: "10px",
                marginLeft: "10px",
              }}
              type={activiti == "cancel" ? "primary" : "ghost"}
              onClick={cancel}
            >
              Cancelar Validación
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
                Aceptar Validación
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
                Cancelar Validación
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Fragment>
          <ValidationTableStudy
            data={studys}
            columns={ValidationStudyColumns({ printTicket })}
            expandable={ValidationStudyExpandable({
              activiti,
              verfiy,
              viewTicket,
              visto,
              setvisto,
              updateData,
            })}
          />
        </Fragment>
      </Spin>
    </Fragment>
  );
};

export default observer(ResultValidationTable);
