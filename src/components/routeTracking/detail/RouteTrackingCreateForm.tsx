import { Button, Col, DatePicker, Form, Row, Spin, TreeSelect } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { ITagTrackingOrder } from "../../../app/models/routeTracking";
import { IOptions } from "../../../app/models/shared";
import {
  IRouteTrackingForm,
  IStudyTrackinOrder,
  TrackingOrderFormValues,
} from "../../../app/models/trackingOrder";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { formItemLayout } from "../../../app/util/utils";
import RouteTrackingCreateTable from "./RouteTrackingCreateTable";
import { TagTrackingModal } from "./modal/TagTrackingModal";
import { FlagFilled } from "@ant-design/icons";
import { toJS } from "mobx";

type UrlParams = {
  id: string;
};

const RouteTrackingCreateForm = () => {
  const { optionStore, profileStore, routeStore, routeTrackingStore } =
    useStore();
  const {
    getFindTags,
    tagsSelected,
    tagCreateData: tagData,
    setTagCreateData: setTagData,
    routeStudies,
    setRouteStudies,
    createTrackingOrder,
    updateTrackingOrder,
    scan,
    setScan,
    getById,
    getStudyTrackingOrder,
  } = routeTrackingStore;
  const { getByOriginDestination, loadingRoutes } = routeStore;
  const { profile } = profileStore;
  const {
    getBranchOptions,
    getMaquiladorOptions,
    BranchOptions,
    MaquiladorOptions,
  } = optionStore;

  const navigate = useNavigate();
  const [form] = Form.useForm<IRouteTrackingForm>();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readOnly, setReadOnly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const { id } = useParams<UrlParams>();
  const [values, setValues] = useState<IRouteTrackingForm>(
    new TrackingOrderFormValues()
  );

  const [routeOptions, setRouteOptions] = useState<IOptions[]>([]);
  const [originBranch, setOriginBranch] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    getBranchOptions();
    getMaquiladorOptions();
  }, [getBranchOptions, getMaquiladorOptions]);

  useEffect(() => {
    const readTrackingOrder = async (id: string) => {
      setLoading(true);
      const order = await getById(id);

      if (order) {
        order.diaRecoleccion = moment(order.diaRecoleccion);
        let idTags = order.etiquetas.map((x) => {
          let study = getStudyTrackingOrder(x);
          return study;
        });
        setRouteStudies(idTags);

        setTagData([...order.etiquetas, ...tagsSelected]);
        await getRoutes(order.destino, order.diaRecoleccion, order.origenId);

        setValues(order);
        form.setFieldsValue(order);
      }
      setLoading(false);
    };

    if (id) {
      readTrackingOrder(id);
    }
  }, [getById, id, tagsSelected]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      form.setFieldValue("origenId", [profileBranch]);
      setOriginBranch(profileBranch);
    }

    form.setFieldValue("escaneo", scan);
  }, [profile, scan]);

  const treeData = [
    {
      title: "Sucursales",
      value: "destinoId",
      disabled: true,
      children: BranchOptions.filter((x) => x.value !== originBranch).map(
        (x) => ({
          title: x.label,
          value: x.value,
        })
      ),
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

  const getRoutes = async (
    value: string,
    dateForm?: moment.Moment | null,
    origin?: string
  ) => {
    setDestination(value);
    let originRoute = origin || originBranch;

    if (value === "") return alerts.warning(messages.destinationNotFound);
    if (originRoute === "") return alerts.warning(messages.originNotFound);

    const routes = await getByOriginDestination(value, originRoute);

    if (routes) {
      const routesByDate = routes.filter((x) => {
        const date = moment(x.horaDeRecoleccion);
        const dateHour = date.hour();
        const dateMinute = date.minute();

        const today = moment(dateForm);
        const todayHour = today.hour();
        const todayMinute = today.minute();

        return (
          todayHour < dateHour ||
          (todayHour === dateHour && todayMinute <= dateMinute)
        );
      });

      const options = routesByDate.map((x) => ({
        label: x.nombre,
        value: x.id,
      }));

      if (options.length === 0) return form.setFieldValue("rutaId", []);

      setRouteOptions(options);
    }
  };

  const isReadOnly = () => {
    if (id || searchParams.get("mode") === "readonly") {
      return true;
    }
    return false;
  };

  const onDateChange = async (value: moment.Moment | null) => {
    getRoutes(destination, value);
  };

  const findTagsByRoute = async (routeId: string) => {
    setLoading(true);
    const route = routeId === undefined ? "" : routeId;
    const tags = await getFindTags(route);
    if (tags) {
      setTagData([...tags, ...tagsSelected]);
    }
    setLoading(false);
  };

  const findRequest = async (value: React.KeyboardEvent<HTMLInputElement>) => {
    setLoading(true);
    let search = value.currentTarget.value;
    if (search === "") search = "all";

    await TagTrackingModal(search, tagsSelected);
    setLoading(false);
  };

  const onActiveChange = (value: boolean) => {
    if (value) {
      alerts.info(messages.confirmations.enable);
    } else {
      alerts.info(messages.confirmations.disable);
    }
  };

  const onScan = (value: boolean) => {
    setTagData(tagData.map((x) => ({ ...x, escaneo: value })));
    setScan(value);

    let studies = tagData.map((x) => {
      let study = getStudyTrackingOrder(x);
      study.escaneo = value;
      return study;
    });
    setRouteStudies(studies);
    if (!value) setRouteStudies([]);
  };

  const onConfirmTracking = () => {
    setLoading(true);
    if (id && !editable) {
      alerts.confirm(
        "Confirmar recolección",
        "¿Está seguro que desea confirmar la recolección de muestras?",
        async () => {
          setLoading(false);
          form.submit();
        },
        async () => {
          setLoading(false);
        }
      );
    } else {
      form.submit();
    }
  };

  const onCancelTrackng = () => {
    setLoading(true);
    if (id) {
      alerts.confirm(
        "Cancelar orden de seguimiento",
        "¿Está seguro que desea cancelar la orden de seguimiento?",
        async () => {
          setLoading(false);
          onFinish(values, true);
        },
        async () => {
          setLoading(false);
        }
      );
    } else {
      navigate(`/segRutas`);
    }
  };

  const onFinish = async (
    newOrder: IRouteTrackingForm,
    isCancelation?: boolean
  ) => {
    setLoading(true);
    const order = { ...values, ...newOrder };

    order.estudios = routeStudies;
    order.destino = destination.toString();
    order.origenId = originBranch;
    order.diaRecoleccion = moment(order.diaRecoleccion).utcOffset(0, true);

    if (isCancelation) order.cancelacion = true;
    if (editable) order.editar = true;

    console.log(order.estudios)

    let success = false;
    if (!id) {
      success = await createTrackingOrder(order);
    } else {
      success = await updateTrackingOrder(order);
    }
    setLoading(false);
    if (success) {
      goBack();
    }
  };

  return (
    <Spin spinning={loading} tip={"Cargando"}>
      <Row gutter={[4, 16]}>
        {!readOnly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={onCancelTrackng}>
              {id ? "Cancelar orden de seguimiento" : "Cancelar"}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onConfirmTracking}
            >
              {!id || editable
                ? "Guardar orden de seguimiento"
                : "Confirmar recolección"}
            </Button>
            {id && !editable && (
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={() => setEditable(true)}
              />
            )}
            {id && editable && (
              <Button type="default" onClick={() => setEditable(false)}>
                <FlagFilled />
              </Button>
            )}
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
        <Col md={24} sm={12}>
          <Form<IRouteTrackingForm>
            {...formItemLayout}
            form={form}
            name="trackingOrder"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            labelWrap
          >
            <Row>
              <Col md={6} sm={12}>
                <Form.Item label="Destino" name="destino">
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    treeData={treeData}
                    treeDefaultExpandAll
                    onChange={(value) => getRoutes(value.toString())}
                    disabled={isReadOnly()}
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
                  onChange={(value) => setOriginBranch(value)}
                  options={BranchOptions}
                  readonly={isReadOnly()}
                />
              </Col>
              <Col md={6} sm={12}>
                <Form.Item label="Fecha recolección" name="diaRecoleccion">
                  <DatePicker
                    style={{ width: "100%" }}
                    defaultValue={moment()}
                    format="DD/MM/YYYY HH:mm"
                    minuteStep={1}
                    showTime
                    allowClear
                    disabledDate={(current) => current.isBefore(moment())}
                    onChange={(value) => onDateChange(value)}
                    disabled={isReadOnly()}
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
                  loading={loadingRoutes}
                  options={routeOptions ?? []}
                  readonly={isReadOnly()}
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <TextInput
                  formProps={{
                    name: "muestra",
                    label: "Muestra",
                  }}
                  max={100}
                  onPressEnter={findRequest}
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
                  readonly={false}
                  controls={false}
                />
              </Col>
              <Col md={6} sm={12}>
                <SwitchInput
                  name="escaneo"
                  label="Escaneo"
                  readonly={readOnly}
                  onChange={(value) => onScan(value)}
                />
              </Col>
              <Col md={6} sm={12}>
                <SwitchInput
                  name="activo"
                  onChange={onActiveChange}
                  label="Activo"
                  readonly={readOnly}
                />
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={24} sm={12}>
          <RouteTrackingCreateTable />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RouteTrackingCreateForm);
