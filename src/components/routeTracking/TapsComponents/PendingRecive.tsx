import { Button, Col, Form, Row, Table, Tag } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IUpdate } from "../../../app/models/sampling";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ExpandableConfig } from "antd/lib/table/interface";
import IconButton from "../../../app/common/button/IconButton";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { ClockCircleOutlined } from "@ant-design/icons";
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
    studyTags: studys,
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
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("estudio", "Estudio", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal de procedencia", {
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
    const reagent = { ...values, ...newValues };

    var search = reagent;
    search.sucursaldest = profile!.sucursal;
    let studios = [];
    var datas = await getAllRecive(search!);
    datas?.forEach((x: any) => studios.push(x.pendings));
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
                label: "Sucursal(es) receptor(as)",
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
              autoFocus
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
