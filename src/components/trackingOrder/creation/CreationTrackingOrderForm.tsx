import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  TreeSelect,
  DatePicker,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useSearchParams } from "react-router-dom";
import {
  ITrackingOrderForm,
  TrackingOrderFormValues,
} from "../../../app/models/trackingOrder";

import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { observer } from "mobx-react-lite";
import SelectInput from "../../../app/common/form/SelectInput";
import CreationTrackingOrderTable from "./CreationTrackingOrderTable";
import moment from "moment";
import DateInput from "../../../app/common/form/proposal/DateInput";
import { IDias, IRouteForm, RouteFormValues } from "../../../app/models/route";
import _ from "lodash";
import { IOptions } from "../../../app/models/shared";
import TextInput from "../../../app/common/form/proposal/TextInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import { daysOfWeek } from "../../../app/util/catalogs";

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
  const { profile, getProfile } = profileStore;
  const { find, foundRoutes, routes } = routeStore;
  const {
    getSucursalesOptions,
    sucursales,
    BranchOptions,
    getAllBranchOptions,
    MaquiladorOptions,
    getMaquiladorOptions,
    profileOptions,
    getProfileOptions,
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
    values.sucursalOrigenId = profileOptions?.sucursal;
    form.setFieldsValue(values!);
  };

  useEffect(() => {
    getSucursalesOptions();
    getAllBranchOptions();
    getMaquiladorOptions();
    setSucursalOrigenInicial();
    getProfileOptions();
  }, [
    getSucursalesOptions,
    getAllBranchOptions,
    getMaquiladorOptions,
    profile,
    getProfileOptions,
  ]);

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


  const [routeFoundOptions, setRouteFoundOptions] = useState<IOptions[]>([]);
  const selecteddestino = Form.useWatch("sucursalDestinoId", form);

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
    hora = moment().hours()
  ) => {
    let formValues = form.getFieldsValue();
    formValues = { ...formValues };

    let routeForms: IRouteForm = new RouteFormValues();
    routeForms.sucursalOrigenId = formValues.sucursalOrigenId!;

    routeForms.dias = daysOfWeek.filter((x) => x.id === moment().day());

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
    setValues(newValues);
    setNewTrackingOrder({ ...newValues });
    setConfirmCreationOrder(true);
  };

  useEffect(() => {
    if (searchParams.get("mode") === "readonly") {
      setNewTrackingOrder({ ...values });
    }
  }, [values]);

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

      <div ref={componentRef} style={{ display: printing ? "none" : "" }}>
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
              console.log(changes_values[propertyForm]);
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
          <Row gutter={[24, 8]}>
            <Col md={6} sm={12}>
              <Form.Item label="Destino" name="sucursalDestinoId">
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeData}
                  treeDefaultExpandAll
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col md={6} sm={12}>
              <SelectInput
                formProps={{
                  name: "sucursalOrigenId",
                  label: "Origen",
                }}
                required
                options={sucursales}
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
                readonly={readonly}
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
                readonly={readonly}
              />
            </Col>
          </Row>
        </Form>

        <Row>
          <Col md={24} sm={12}>
            <CreationTrackingOrderTable id={id} printing={printing} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default observer(CreationTrackingOrderForm);
