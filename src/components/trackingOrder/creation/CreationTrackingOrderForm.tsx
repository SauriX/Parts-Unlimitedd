import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  TreeSelect,
} from "antd";
import useWindowDimensions from "../../../app/util/window";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ITrackingOrderForm,
  TrackingOrderFormValues,
  ITrackingOrderList,
} from "../../../app/models/trackingOrder";

import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { observer } from "mobx-react-lite";
import SelectInput from "../../../app/common/form/SelectInput";
import CreationTrackingOrderTable from "./CreationTrackingOrderTable";
import moment from "moment";
import DateInput from "../../../app/common/form/proposal/DateInput";
import { IDias, IRouteForm, RouteFormValues } from "../../../app/models/route";
import _ from "lodash";
import NumberInput from "../../../app/common/form/NumberInput";
import { IOptions } from "../../../app/models/shared";

type TrackingOrderFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CreationTrackingOrderForm: FC<TrackingOrderFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { trackingOrderStore, profileStore, optionStore, routeStore } =
    useStore();
  const { profile } = profileStore;
  const { find, foundRoutes, routes } = routeStore;
  const {
    getSucursalesOptions,
    sucursales,
    sucursalesClave,
    BranchOptions,
    getBranchOptions,
    MaquiladorOptions,
    getMaquiladorOptions,
  } = optionStore;
  const {
    getById,
    create,
    update,
    getAll,
    trackingOrder,
    getStudiesByStudiesRoute,
    setTemperature,
    confirmarRecoleccionSend,
    cancelarRecoleccionSend,
    setSendData,
    setTemperatura,
  } = trackingOrderStore;

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<ITrackingOrderForm>();

  const [loading, setLoading] = useState(false);

  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<ITrackingOrderForm>(
    new TrackingOrderFormValues()
  );
  const [rutaSeleccionada, setRutaSeleccionada] = useState<IRouteForm>(
    new RouteFormValues()
  );
  const [confirmCreationOrder, setConfirmCreationOrder] = useState<boolean>();
  const [confirmarRecoleccion, setConfirmarRecoleccion] = useState(true);
  const [cancelarRecoleccion, setCancelarRecoleccion] = useState(true);

  const [newTrackingOrder, setNewTrackingOrder] = useState<ITrackingOrderForm>(
    new TrackingOrderFormValues()
  );
  const treeData = [
    {
      title: "Sucursales",
      value: "sucursalDestinoId",
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
  const setSucursalOrigenInicial = () => {
    values.sucursalOrigenId = profile!.sucursal;
    form.setFieldsValue(values!);
  };
  useEffect(() => {
    getSucursalesOptions();
    getBranchOptions();
    getMaquiladorOptions();
    setSucursalOrigenInicial();
  }, [getSucursalesOptions, getBranchOptions, getMaquiladorOptions, profile]);

  useEffect(() => {
    const readTrackingOrder = async (id: string) => {
      setLoading(true);
      const trackingOrder = await getById(id);
      form.setFieldsValue(trackingOrder!);
      setValues(trackingOrder!);

      if (trackingOrder?.isInRute) {
        setCancelarRecoleccion(false);
      } else {
        setConfirmarRecoleccion(false);
      }
      setLoading(false);
    };

    if (id) {
      readTrackingOrder(id);
    }
  }, [id]);

  const dias: IDias[] = [
    { id: 1, dia: "L" },
    { id: 2, dia: "M" },
    { id: 3, dia: "M" },
    { id: 4, dia: "J" },
    { id: 5, dia: "V" },
    { id: 6, dia: "S" },
    { id: 7, dia: "D" },
  ];
  const [routeFoundOptions, setRouteFoundOptions] = useState<IOptions[]>([]);
  const selecteddestino = Form.useWatch("sucursalDestinoId", form);
  const routesoptions: IOptions[] = foundRoutes.map((route) => {
    var data: IOptions = {
      value: route.id,
      label: route.nombre,
    };

    return data;
  });

  const getrutes = (id: string) => {
    const findedRoutes = [...foundRoutes];
    let filterRoutes: IRouteForm[] = [];
    findedRoutes.forEach((x) => {
      if (x.sucursalDestinoId == id || x.maquiladorId == id) {
        filterRoutes.push(x);
      }
    });

    const routesfilteredoptions: IOptions[] = filterRoutes!.map((route) => {
      var data: IOptions = {
        value: route.id,
        label: route.nombre,
      };

      return data;
    });
    setRouteFoundOptions(routesfilteredoptions);
    form.setFieldValue("rutaId", undefined);
  };
  useEffect(() => {
    getrutes(selecteddestino);
  }, [selecteddestino]);
  useEffect(() => {
    getrutes(selecteddestino);
  }, [foundRoutes]);
  const initialSerachRoutes = async (
    initial = true,
    hora = moment().hours() + 1
  ) => {
    let formValues = form.getFieldsValue();
    formValues = { ...formValues };

    let routeForms: IRouteForm = new RouteFormValues();
    routeForms.horaDeRecoleccion = hora;
    routeForms.sucursalOrigenId = formValues.sucursalOrigenId!;
    const parent = treeData.find((x) =>
      x.children.map((x) => x.value).includes(formValues.sucursalDestinoId!)
    );

    routeForms.dias = dias.filter((x) => x.id === moment().day());

    var rutes = await find(routeForms);
    return rutes;
  };

  useEffect(() => {
    const readTrackingOrder = async () => {
      setLoading(true);
      await initialSerachRoutes();
      setLoading(false);
    };
    readTrackingOrder();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: ITrackingOrderForm) => {
    const trackingOrderSend = { ...newTrackingOrder, ...newValues };
    if (
      trackingOrderSend.id === "" ||
      trackingOrderSend === null ||
      trackingOrderSend === undefined
    ) {
      trackingOrderSend.id = "00000000-0000-0000-0000-000000000000";
    }
    const parent = treeData.find((x) =>
      x.children
        .map((x) => x.value)
        .includes(trackingOrderSend.sucursalDestinoId)
    );
    trackingOrderSend.SucrusalOrigenNombre =
      "" +
      BranchOptions.find(
        (branch) => branch.value === trackingOrderSend.sucursalOrigenId
      )?.label;
    if (parent?.title === "Sucursales") {
      trackingOrderSend.sucursalDestinoId =
        "" + trackingOrderSend.sucursalDestinoId;
      trackingOrderSend.SucrusalOrigenNombre =
        "" +
        BranchOptions.find(
          (branch) => branch.value === trackingOrderSend.sucursalDestinoId
        )?.label;
    } else {
      trackingOrderSend.maquiladorId = +trackingOrderSend.sucursalDestinoId;
      trackingOrderSend.sucursalDestinoId = "";
      trackingOrderSend.SucursalDestinoNombre =
        "" +
        MaquiladorOptions.find(
          (maquila) => maquila.value === trackingOrderSend.maquiladorId
        )?.label;
    }
    let success = false;
    trackingOrderSend.horaDeRecoleccion = rutaSeleccionada.horaDeRecoleccion;
    let estudiosFiltrados = trackingOrder
      .filter((order) => order.escaneado)
      .map((order) => {
        let estudio = order.estudio!;
        return {
          clave: estudio.clave,
          estudio: estudio.estudio,
          solicitud: estudio.solicitud,
          solicitudId: estudio.solicitudId,
          nombrePaciente: estudio.nombrePaciente,
          expedienteId: estudio.expedienteId,
          escaneado: order.escaneado,
          temperatura: order.temperatura,
          estudioId: estudio.estudioId,
        };
      });
    trackingOrderSend.estudios = _.flatten(estudiosFiltrados);
    trackingOrderSend.clave = sucursalesClave.find(
      (sucursal: any) => sucursal.value === profile!.sucursal
    ).clave;

    trackingOrderSend.RutaNombre = rutaSeleccionada.nombre;

    setSendData(trackingOrderSend);
    if (trackingOrderSend.estudios.length <= 0) {
      alerts.error("La orden de seguimiento debe Contener al menos un estudio");
      return;
    }
    if (confirmCreationOrder) {
      setLoading(true);
      if (id) {
        trackingOrderSend.id = id;
        await update(trackingOrderSend);
        success = true;
      } else {
        success = await create(trackingOrderSend);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("mode") === "readonly") {
      setNewTrackingOrder({ ...values });
    }
  }, [values]);
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ITrackingOrderList> = [
    {
      ...getDefaultColumnProps("clave", "Clave Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("area", "Area", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
  ];
  const findStudiesByStudiesRoute = async (value: any) => {
    const ruta: any = foundRoutes.find((ruta) => ruta.id === value);
    setRutaSeleccionada(ruta);
    form.setFieldValue(
      "sucursalDestinoId",
      ruta.maquiladorId ?? ruta.sucursalDestinoId
    );

    const estudiosId = ruta.estudio.map((estudio: any) => estudio.id);
    setLoading(true);
    await getStudiesByStudiesRoute(estudiosId);
    setLoading(false);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!readonly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={confirmarRecoleccion}
              onClick={async (e) => {
                e.preventDefault();
                await confirmarRecoleccionSend();
                setCancelarRecoleccion(false);
                setConfirmarRecoleccion(true);
              }}
            >
              Confirmar recolección
            </Button>
            <Button
              disabled={cancelarRecoleccion}
              onClick={async (e) => {
                e.preventDefault();
                cancelarRecoleccionSend();
                setCancelarRecoleccion(true);
                setConfirmarRecoleccion(false);
              }}
            >
              Cancelar
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={12} sm={24} style={{ textAlign: "right" }}>
            {readonly && (
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={() => {
                  setReadonly(false);
                }}
              />
            )}
          </Col>
        )}
      </Row>

      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle
                  title="Creación de orden de seguimiento"
                  image="ordenseguimiento"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ITrackingOrderForm>
            {...formItemLayout}
            form={form}
            name="trackingOrder"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            labelWrap
            onValuesChange={async (changes_values: any) => {
              const propertyForm = Object.keys(changes_values)[0];
              if (propertyForm == "temperatura") {
                setTemperatura(changes_values[propertyForm]);
                setTemperature(changes_values[propertyForm]);
              }
              if (propertyForm === "fecha") {
                var date = changes_values[propertyForm];
                setRouteFoundOptions([]);
                if (moment().diff(date) < 0) {
                  await initialSerachRoutes(true, 0);
                } else {
                  await initialSerachRoutes(true);
                }
              }
            }}
          >
            <Row>
              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <DateInput
                  formProps={{ label: "Día de recolección", name: "fecha" }}
                  style={{ marginBottom: 24 }}
                  required
                  readonly={readonly}
                  disabledDates={(current: moment.Moment) =>
                    current.isBefore(moment(), "day")
                  }
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <Form.Item label="Destino" name="sucursalDestinoId">
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    treeData={treeData}
                    treeDefaultExpandAll
                  />
                </Form.Item>
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <SelectInput
                  formProps={{
                    name: "sucursalOrigenId",
                    label: "Origen",
                  }}
                  required
                  readonly={true}
                  options={sucursales}
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <SelectInput
                  options={routeFoundOptions}
                  formProps={{
                    name: "rutaId",
                    label: "Ruta",
                  }}
                  onChange={(value) => {
                    if (value) {
                      findStudiesByStudiesRoute(value);
                      form.setFieldValue("rutaId", value);
                    }
                  }}
                  readonly={readonly}
                />
              </Col>

              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <TextInput
                  formProps={{
                    name: "muestraId",
                    label: "Muestra",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>

              <Col md={6} sm={12} style={{ textAlign: "left" }}>
                <NumberInput
                  formProps={{
                    name: "temperatura",
                    label: "Temperatura",
                  }}
                  required
                  readonly={false}
                />
              </Col>
              <Col md={8} sm={12} style={{ textAlign: "left" }}>
                <SwitchInput
                  name="escaneoCodigoBarras"
                  label="Escaneo por código de barras"
                  readonly={readonly}
                  style={{
                    marginLeft: 90,
                  }}
                />
              </Col>
              <Col md={3} sm={12} style={{ textAlign: "left" }}>
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
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>
          <Row style={{ marginBottom: 24 }}>
            {!readonly && (
              <Col md={24} sm={24} xs={12} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={async (e) => {
                    let noEscaneados = trackingOrder.some(
                      (order) => !order.escaneado
                    );
                    if (noEscaneados) {
                      await alerts.confirm(
                        "",
                        "Se detectaron faltante de muestras sin confirmación de escaneo",
                        async () => {
                          setConfirmCreationOrder(true);
                          form.submit();
                        },
                        () => setConfirmCreationOrder(false),
                        null,
                        "Cancelar captura de orden"
                      );
                    } else {
                      setConfirmCreationOrder(true);
                      form.submit();
                    }
                  }}
                >
                  Guardar orden
                </Button>
              </Col>
            )}
          </Row>

          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            >
              <CreationTrackingOrderTable id={id} printing={printing} />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CreationTrackingOrderForm);
