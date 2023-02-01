import { Button, Col, Form, Row, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { EditOutlined } from "@ant-design/icons";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import {
  IRouteList,
  SearchTracking,
  TrackingFormValues,
} from "../../../app/models/routeTracking";
import IconButton from "../../../app/common/button/IconButton";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import { formItemLayout } from "../../../app/util/utils";
const PendingSend = () => {
  const { optionStore, routeTrackingStore, profileStore } = useStore();
  const {
    getAll,
    studys,
    printTicket,
    loadingRoutes,
    exportForm,
    setventana,
    searchrecive,
    setSearchRecive,
  } = routeTrackingStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { profile } = profileStore;

  const [form] = Form.useForm<SearchTracking>();

  let navigate = useNavigate();
  useEffect(() => {
    const readPriceList = async () => {
      let studios = [];
      var datas = await getAll(searchrecive!);
      getBranchCityOptions();
      setventana("enviar");
      datas?.forEach((x: any) => studios.push(x.studys));
    };

    if (studys.length === 0) {
      readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IRouteList> = [
    {
      ...getDefaultColumnProps("seguimiento", "No. de seguimiento", {
        searchState,
        setSearchState,
        width: "10%",
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
        width: "10%",
      }),
    },
    {
      key: "Solicitud",
      dataIndex: "solicitud",
      title: "Solicitud",
      align: "center",
      width: "10%",
      render: (value) => value,
    },
    {
      key: "editar",
      dataIndex: "status",
      title: "Estatus",
      align: "center",
      width: "10%",
      render: (value) => value,
    },
    {
      ...getDefaultColumnProps("estudio", "Estudio", {
        searchState,
        setSearchState,
        width: "15%",
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
      key: "fecha",
      dataIndex: "fecha",
      title: "Fecha de entrega",
      align: "center",
      width: "10%",
      render: (value) => value,
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
    const search = { ...searchrecive, ...newValues };

    setSearchRecive(search);
    let studios = [];
    var datas = await getAll(search!);
    datas?.forEach((x: any) => studios.push(x.pendings));
    let success = false;
  };
  return (
    <Fragment>
      <Form<SearchTracking>
        {...formItemLayout}
        form={form}
        name="reagent"
        initialValues={searchrecive}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row gutter={[0, 12]}>
          <Col span={6}>
            <DateRangeInput
              formProps={{ name: "fechas", label: "Fecha" }}
            ></DateRangeInput>
          </Col>
          <Col span={5}>
            <SelectInput
              options={branchCityOptions}
              formProps={{
                name: "sucursal",
                label: "Destino",
                labelCol: { span: 12 },
                wrapperCol: { span: 14 },
              }}
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

      <div style={{ marginTop: "2%" }}>
        <Table<IRouteList>
          loading={loadingRoutes}
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={[...studys]}
          bordered
        ></Table>
      </div>
    </Fragment>
  );
};
export default observer(PendingSend);
