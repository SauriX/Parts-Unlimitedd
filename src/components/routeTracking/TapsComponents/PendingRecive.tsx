import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  PageHeader,
  Row,
  Switch,
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
  SearchTracking,
  TrackingFormValues,
} from "../../../app/models/routeTracking";
import IconButton from "../../../app/common/button/IconButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import alerts from "../../../app/util/alerts";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import { ClockCircleOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Steps } from "antd";
import DateInput from "../../../app/common/form/proposal/DateInput";
import moment from "moment";
import {
  IRecibe,
  IStatus,
  searchValues,
  ISearchPending,
  IReciveStudy,
} from "../../../app/models/pendingRecive";
import { formItemLayout } from "../../../app/util/utils";
/* const pendings:IRecibe[] = [{
  id:"1",
  nseguimiento:"1234456",
  claveroute:"R01",
  sucursal:"Monterrey",
  fechaen:moment(moment.now()),
  horaen:moment(moment.now()),
  fechareal:moment(moment.now()),
  study :[{
    id:"1234",
    estudio:"QSP,TRI",
    solicitud:"123123123",
    horarecoleccion:moment(moment.now()),
    check:moment(moment.now()),
  },{
    id:"45678",
    estudio:"GLU,UREA",
    solicitud:"123123123",
    horarecoleccion:moment(moment.now()),
    check:moment(moment.now()),
  }],
  extra:[{
    id:"1",
    clave:"EGO",
    estudio:"Examen General de orina",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:false
  },{
    id:"2",
    clave:"VH",
    estudio:"Citologia ematica",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:true
  },{
    id:"1",
    clave:"CA",
    estudio:"Calcio serico",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:true
  }],
  status:{
    created:true,
    smpling:true,
    route:true,
    entregado:false,
  }
},
{
  id:"1",
  nseguimiento:"1234456",
  claveroute:"R01",
  sucursal:"Monterrey",
  fechaen:moment(moment.now()),
  horaen:moment(moment.now()),
  fechareal:moment(moment.now()),
  study :[{
    id:"1234",
    estudio:"QSP,TRI",
    solicitud:"123123123",
    horarecoleccion:moment(moment.now()),
    check:moment(moment.now()),
  },{
    id:"45678",
    estudio:"GLU,UREA",
    solicitud:"123123123",
    horarecoleccion:moment(moment.now()),
    check:moment(moment.now()),
  }],
  extra:[{
    id:"1",
    clave:"EGO",
    estudio:"Examen General de orina",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:false
  },{
    id:"2",
    clave:"VH",
    estudio:"Citologia ematica",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:true
  },{
    id:"1",
    clave:"CA",
    estudio:"Calcio serico",
    solicitud:"23123",
    paciente:"Andre Ruiz Montalvo",
    escaneado:true
  }],
  status:{
    created:true,
    smpling:true,
    route:true,
    entregado:true,
  }
},
] */
const PendingRecive = () => {
  const {
    procedingStore,
    optionStore,
    locationStore,
    samplingStudyStore: samplig,
    routeTrackingStore,
    profileStore,
  } = useStore();
  const {
    getAll,
    studys,
    printTicket,
    update,
    exportForm,
    getAllRecive,
    pendings,
    setSearchi,
    setventana,
  } = routeTrackingStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { profile } = profileStore;
  //const [values, setValues] = useState<SearchTracking>(new TrackingFormValues());
  const [updateData, setUpdateDate] = useState<IUpdate[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const { Step } = Steps;
  const [solicitudesData, SetSolicitudesData] = useState<string[]>([]);
  const [activiti, setActiviti] = useState<string>("");
  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const [openRows, setOpenRows] = useState<boolean>(false);
  const [expandable, setExpandable] = useState<ExpandableConfig<IRecibe>>();
  const [form] = Form.useForm<ISearchPending>();
  const [values, setValues] = useState<ISearchPending>(new searchValues());
  const [estatus, setEstatus] = useState<IStatus>({
    created: false,
    smpling: false,
    route: false,
    entregado: false,
  });
  const [current, setCurrent] = useState<number>(-1);
  let navigate = useNavigate();

  useEffect(() => {
    if (estatus.route) {
      setCurrent(2);
    }
    if (estatus.entregado) {
      setCurrent(3);
    }
    if (
      estatus.created &&
      estatus.smpling &&
      !estatus.route &&
      !estatus.entregado
    ) {
      setCurrent(1);
    }
  }, [estatus]);
  useEffect(() => {
    setexpandedRowKeys(pendings!.map((x) => x.id));
    setOpenRows(true);
  }, [pendings]);
  useEffect(() => {
    console.log(profile, "user");
    const readPriceList = async () => {
      var search = values;
      search.sucursaldest = profile!.sucursal;
      let studios = [];
      var datas = await getAllRecive(search!);
      setSearchi(search);
      datas?.forEach((x: any) => studios.push(x.pendings));
      setventana("recive");
      await getBranchCityOptions();
    };

    if (pendings!.length === 0) {
      readPriceList();
    }
    console.log(getExpandableConfig("estudios"), "config");
    setExpandable(expandableStudyConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllRecive]);

  const onExpand = (isExpanded: boolean, record: IRecibe) => {
    let expandRows: string[] = [...expandedRowKeys];

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
      }
    }
    var datos: IUpdate = {
      estudioId: ids,
      solicitudId: solicitud,
    };
    setUpdateDate((prev) => [...prev!, datos]);
  };
  const columnsStudy: IColumns<IReciveStudy> = [
    {
      ...getDefaultColumnProps("estudio", "Estudio", {
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        width: "15%",
      }),
    },
    {
      key: "editar",
      dataIndex: "horarecoleccion",
      title: "Hora de recolección",
      align: "center",
      width: "10%",
      render: (value) => moment(value).utc().format("MMMM D YYYY  h:mmA"),
    },
  ];
  const expandableStudyConfig = {
    expandedRowRender: (item: IRecibe, index: number) => (
      <div>
        <h4>Estudios</h4>
        <>
          <Table
            size="small"
            rowKey={(record) => record.id}
            columns={columnsStudy}
            dataSource={[...item.study]}
            bordered
            style={{}}
            className="header-expandable-table"
            pagination={false}
            showHeader={index === 0}
          ></Table>
        </>
        <br />

        <h4>Muestras incluidas por recibir:</h4>
        {item.extra != null &&
          item.extra.map((x) => {
            return (
              <>
                <Descriptions
                  size="small"
                  bordered
                  layout="vertical"
                  style={{ marginBottom: 5 }}
                >
                  <Descriptions.Item
                    label="Clave Estudio"
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
                    {x.estudio}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Solicitud"
                    className="description-content"
                    style={{ maxWidth: 30 }}
                  >
                    {x.solicitud}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Paciente"
                    className="description-content"
                    style={{ maxWidth: 30 }}
                  >
                    {x.paciente}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label=""
                    className="description-content"
                    style={{ maxWidth: 30 }}
                  >
                    <Switch checked={x.escaneado} />
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

  const columns: IColumns<IRecibe> = [
    {
      ...getDefaultColumnProps("nseguimiento", "# De seguimiento", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
      }),
      render: (value, route) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/ReciveTracking/${route.id}`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("claveroute", "Clave de ruta", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Seguimiento",
      align: "center",
      width: "10%",
      render: (value) => (
        <IconButton
          title="status"
          icon={<ClockCircleOutlined />}
          onClick={() => {
            setEstatus(value);
          }}
          
        />
      ),
    },

    {
      ...getDefaultColumnProps("sucursal", "Sucursal de procedencia", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      key: "editar",
      dataIndex: "fechaen",
      title: "Fecha de entrega estimada",
      align: "center",
      width: "10%",
      render: (value) => moment(value).format("MMMM D YYYY"),
    },
    {
      key: "editar",
      dataIndex: "fechaen",
      title: "Hora de entrega estimada",
      align: "center",
      width: "15%",
      render: (value) => moment(value).utc().format("h:mmA"),
    },

    {
      key: "editar",
      dataIndex: "fecha",
      title: "Hora y fecha de entrega real",
      align: "center",
      width: "15%",
      render: (value) => (
        <div>
          {moment(value).utc().format("h:mmA")}
          <br />
          {moment(value).format("MMMM D YYYY")}
        </div>
      ),
    },
  ];

  const steps = [
    {
      title: "Orden creada",
      content: "First-content",
    },
    {
      title: "Toma de muestra",
      content: "Second-content",
    },
    {
      title: "En ruta",
      content: "Last-content",
    },
    {
      title: "Entregado",
      content: "Last-content",
    },
  ];
  const onFinish = async (newValues: ISearchPending) => {
    console.log("onfinish");
    const reagent = { ...values, ...newValues };
    console.log(profile, "user");

    var search = reagent;
    search.sucursaldest = profile!.sucursal;
    let studios = [];
    var datas = await getAllRecive(search!);
    datas?.forEach((x: any) => studios.push(x.pendings));
    setExpandable(expandableStudyConfig);
    console.log(reagent, "en el onfish");
    console.log(reagent);
    let success = false;
  };
  return (
    <Fragment>
      <Form<ISearchPending>
        {...formItemLayout}
        form={form}
        name="reagent"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row gutter={[0, 12]}>
          <Col span={2}></Col>
          <Col span={4}>
            <DateInput
              formProps={{ name: "fecha", label: "Fecha" }}
            ></DateInput>
          </Col>

          <Col span={6}>
            <SelectInput
            form={form}
              formProps={{
                name: "sucursal",
                label: "Sucursales de donde recibir",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              multiple
              options={branchCityOptions}
            />
          </Col>
          <Col span={2}></Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "busqueda",
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
        </Row>
      </Form>
      <br />
      <br />
      <Row style={{ marginLeft: "20%", marginBottom: "2%" }}>
        <Col span={16}>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Col>

        <Col span={8}></Col>
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
        <Table<IRecibe>
          loading={false}
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          pagination={false}
          dataSource={[...pendings!]}
          scroll={{ y: 500 }}
          //(rowClassName={(item) => (item.claveMedico == "Total" || item.paciente === "Total" ? "Resumen Total" : "")}
          expandable={{
            ...expandable,
            onExpand: onExpand,
            expandedRowKeys: expandedRowKeys,
          }}
        />
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Tag color="lime">
            {!hasFooterRow ? pendings?.length : Math.max(pendings?.length!, 0)}{" "}
            Registros
          </Tag>
        </div>
      </Fragment>
    </Fragment>
  );
};
export default observer(PendingRecive);
