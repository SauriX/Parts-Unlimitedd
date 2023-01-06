import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Row,
  Table,
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
  IUpdate,
} from "../../../app/models/sampling";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ExpandableConfig } from "antd/lib/table/interface";
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
const PendingSend = () => {
  const {
    optionStore,
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
  const [cambio, stcambio] = useState<boolean>(false);
  const [updateData, setUpdateDate] = useState<IUpdate[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [form] = Form.useForm<SearchTracking>();
  const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);
  const [activiti, setActiviti] = useState<string>("");
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  const [expandable, setExpandable] = useState<ExpandableConfig<IRouteList>>();
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
      setventana("enviar");
      datas?.forEach((x: any) => studios.push(x.studys));
    };

    if (studys.length === 0) {
      readPriceList();
    }
    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);
  const updatedata = async () => {
    const estudios = updateData.flatMap((x) => x.estudioId).length;
    let solicitudes = 0;

    solicitudes = updateData.length;

    alerts.confirm(
      "",
      `Se han enviado ${estudios} estudios de ${solicitudes} solicitud a estatus en ruta de manera exitosa `,
      async () => {
        var succes = await update(updateData!);
        if (succes) {
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
        let solicitudtoupdate = dataupdate?.find(
          (x) => x.solicitudId == solicitud
        )!;
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
      }
      let solicitudtoupdate = dataupdate.find(
        (x) => x.solicitudId == solicitud
      )!;
      if (solicitudtoupdate?.estudioId.length == 1) {
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

    /*     if (dataupdate.length <= 0) {

      setActivar(false);
    } else {

      setActivar(true);
    } */

    setUpdateDate(dataupdate);
  };
  const columnsStudy: IColumns<IstudyRoute> = [
    {
      key: "Seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: "10%",
      render: (_value, record) => (
        <>
          {record.status === 2 && (
            <Checkbox
              onChange={(e) => {
                onChange(e, record.id, record.solicitudid);
              }}
              disabled={!(activiti == "register")}
            ></Checkbox>
          )}
          {updateData
            .find((x) => x.solicitudId == record.solicitudid)!.estudioId.includes(record.id) ||
          (cambio &&
            updateData
              .find((x) => x.solicitudId == record.solicitudid)!.estudioId.includes(record.id))
            ? ""
            : ""}
          {record.status === 8 && (
            <Checkbox
              onChange={(e) => {
                {
                  onChange(e, record.id, record.solicitudid);
                  stcambio(!cambio);
                }
              }}
              disabled={!(activiti == "cancel")}
            ></Checkbox>
          )}
        </>
      ),
    },
    {
      ...getDefaultColumnProps("clave", "Solicitud", {
        width: "20%",
        minWidth: 150,
      }),
      render: (value, route) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/ShipmentTracking/${route.routeId}`);
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
      ...getDefaultColumnProps("fecha", " Fecha de entrega estimada", {
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
            exportForm(item.id);
          }}
        />
      ),
    },
  ];
  const onFinish = async (newValues: SearchTracking) => {
    const search = { ...values, ...newValues };
    let studios = [];
    var datas = await getAll(search!);
    datas?.forEach((x: any) => studios.push(x.pendings));
    setExpandable(expandableStudyConfig);
    let success = false;
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
              onClick={() => {
                form.submit();
              }}
              type="primary"
            >
              Buscar
            </Button>
          </Col>
          <Col>
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
      <Row style={{ marginBottom: "1%", marginTop: "2%" }}>
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
