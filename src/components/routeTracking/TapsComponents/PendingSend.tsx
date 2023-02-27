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
import moment from "moment";
import { IOptions } from "../../../app/models/shared";
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
  const { branchCityOptions, getBranchCityOptions, BranchOptions } =
    optionStore;
  const { profile, getProfile } = profileStore;

  const [form] = Form.useForm<SearchTracking>();

  let navigate = useNavigate();
  useEffect(() => {
    const readPriceList = async () => {
      let studios = [];
      var datas = await getAll(searchrecive!);
      getBranchCityOptions();
      getProfile();
      setventana("enviar");
      datas?.forEach((x: any) => studios.push(x.studys));
    };

    if (studys.length === 0) {
      readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll, getProfile, getBranchCityOptions]);

  useEffect(() => {
    if (profile && !!BranchOptions.length) {
      const branch = BranchOptions.find((x) => x.value === profile?.sucursal);
      form.setFieldValue("origen", branch);
    }
  }, [BranchOptions, profile]);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IRouteList> = [
    {
      ...getDefaultColumnProps("seguimiento", "No. seguimiento", {
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
      ...getDefaultColumnProps("clave", "Clave muestra", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("etiqueta", "Recipiente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("ruta", "Clave de Ruta", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de entrega", {
        searchState,
        setSearchState,
        width: "10%",
      }),
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
      <div className="status-container">
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
              <SelectInput
                options={[]}
                formProps={{
                  name: "origen",
                  label: "Origen",
                }}
                readonly
              ></SelectInput>
            </Col>
            <Col span={6}>
              <SelectInput
                options={branchCityOptions}
                formProps={{
                  name: "sucursal",
                  label: "Destino",
                }}
              ></SelectInput>
            </Col>
            <Col span={6}>
              <DateRangeInput
                formProps={{ name: "fechas", label: "Fecha" }}
              ></DateRangeInput>
            </Col>
            <Col span={6}>
              <TextInput
                formProps={{
                  name: "buscar",
                  label: "Buscar",
                }}
                autoFocus
              ></TextInput>
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button htmlType="submit" type="primary">
                Buscar
              </Button>
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
      </div>

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
