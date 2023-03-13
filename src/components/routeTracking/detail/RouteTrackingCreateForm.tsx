import { Button, Col, DatePicker, Form, Row, Spin, TreeSelect } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { ITagTrackingOrder } from "../../../app/models/routeTracking";
import { IOptions } from "../../../app/models/shared";
import {
  ITrackingOrderForm,
  TrackingOrderFormValues,
} from "../../../app/models/trackingOrder";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { formItemLayout } from "../../../app/util/utils";
import RouteTrackingCreateTable from "./RouteTrackingCreateTable";

type TrackingOrderProps = {
  id?: string;
};

const RouteTrackingCreateForm = ({ id }: TrackingOrderProps) => {
  const {
    trackingOrderStore,
    optionStore,
    profileStore,
    routeStore,
    routeTrackingStore,
  } = useStore();
  const { create, update, getById } = trackingOrderStore;
  const { getFindTags } = routeTrackingStore;
  const { find, foundRoutes } = routeStore;
  const { profile } = profileStore;
  const {
    getBranchOptions,
    getMaquiladorOptions,
    BranchOptions,
    MaquiladorOptions,
  } = optionStore;

  const navigate = useNavigate();
  const [form] = Form.useForm<ITrackingOrderForm>();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readOnly, setReadOnly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [values, setValues] = useState<ITrackingOrderForm>(
    new TrackingOrderFormValues()
  );
  const [tagData, setTagData] = useState<ITagTrackingOrder[]>([]);
  const [routeOptions, setRouteOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchOptions();
    getMaquiladorOptions();
  }, [getBranchOptions, getMaquiladorOptions]);

  useEffect(() => {
    const readTrackingOrder = async (id: string) => {
      setLoading(true);
      const order = await getById(id);

      if (order) {
        setValues(order);
        form.setFieldsValue(order);
      }
      setLoading(false);
    };

    if (id) {
      readTrackingOrder(id);
    }
  }, [getById, id]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      form.setFieldValue("destinoId", [profileBranch]);
    }
  }, [form, profile]);

  const treeData = [
    {
      title: "Sucursales",
      value: "destinoId",
      disabled: true,
      children: BranchOptions.map((x) => ({
        title: x.label,
        value: x.value,
      })),
    },
    {
      title: "Maquiladores",
      value: "maquiladorId",
      disabled: true,
      children: MaquiladorOptions.map((x) => ({
        title: x.label,
        value: x.value,
      })),
    },
  ];

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate("/segRutas");
  };

  const getRoutes = (value: string) => {
    const routes = foundRoutes.filter(
      (x) => x.destinoId === value || x.maquiladorId === value
    );

    const routesByDate = routes.filter((x) => {
      const date = moment(x.horaDeRecoleccion);
      const today = moment().hour();

      return date.isSameOrAfter(today);
    });

    const options = routesByDate.map((x) => ({
      label: x.nombre,
      value: x.id,
    }));

    setRouteOptions(options);
  };

  const findTagsByRoute = async (routeId: string) => {
    setLoading(true);
    const tags = await getFindTags(routeId);
    if (tags) {
      setTagData(tags);
    }
    setLoading(false);
  };

  const findRequest = async (value: string) => {
    setLoading(true);
    
    setLoading(false);
  };

  const onFinish = async (newOrder: ITrackingOrderForm) => {
    setLoading(true);
    let success = false;
    if (!id) {
      success = await create(newOrder);
      alerts.success(messages.created);
    } else {
      success = await update(newOrder);
      alerts.success(messages.updated);
    }
    setLoading(false);
    if (success) {
      goBack();
    }
  };

  return (
    <Spin spinning={loading} tip={"Cargando"}>
      <Row gutter={[4, 12]}>
        {!readOnly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button>Cancelar</Button>
            <Button type="primary" htmlType="submit">
              Confirmar recolección
            </Button>
          </Col>
        )}
        {readOnly && (
          <Col md={12} sm={24} style={{ textAlign: "right" }}>
            {readOnly && (
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={() => {
                  setReadOnly(false);
                }}
              />
            )}
          </Col>
        )}
      </Row>

      <Form<ITrackingOrderForm>
        {...formItemLayout}
        form={form}
        name="trackingOrder"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
        labelWrap
      >
        <Row gutter={[24, 8]}>
          <Col md={6} sm={12}>
            <Form.Item label="Destino" name="sucursalDestinoId">
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={treeData}
                treeDefaultExpandAll
                onChange={getRoutes}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col md={6} sm={12}>
            <SelectInput
              formProps={{
                name: "origenId",
                label: "Origen",
              }}
              required
              options={BranchOptions}
            />
          </Col>
          <Col md={6} sm={12}>
            <Form.Item label="Fecha recolección" required>
              <DatePicker
                style={{ width: "100%" }}
                defaultValue={moment()}
                name="fecha"
                format="DD/MM/YYYY HH:mm"
                minuteStep={1}
                showTime
                allowClear
                disabledDate={(current) => current.isBefore(moment())}
              />
            </Form.Item>
          </Col>
          <Col md={6} sm={12}>
            <SelectInput
              formProps={{
                name: "rutaId",
                label: "Ruta",
              }}
              onChange={findTagsByRoute}
              options={routeOptions ?? []}
              readonly={readOnly}
            />
          </Col>
          <Col md={6} sm={12} style={{ textAlign: "left" }}>
            <TextInput
              formProps={{
                name: "muestraId",
                label: "Muestra",
              }}
              max={100}
              readonly={readOnly}
            />
          </Col>
          <Col md={6} sm={12} style={{ textAlign: "left" }}>
            <NumberInput
              formProps={{
                name: "temperatura",
                label: "Temperatura",
              }}
              type="number"
              suffix="°C"
              required
              readonly={false}
              controls={false}
            />
          </Col>
          <Col md={6} sm={12}>
            <SwitchInput
              name="escaneoCodigoBarras"
              label="Escaneo"
              readonly={readOnly}
            />
          </Col>
          <Col md={6} sm={12}>
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
              readonly={readOnly}
            />
          </Col>
        </Row>
      </Form>

      <Row>
        <Col md={24} sm={12}>
          <RouteTrackingCreateTable data={tagData} loading={loading} />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RouteTrackingCreateForm);
