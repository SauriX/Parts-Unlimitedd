import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Table,
  List,
  Typography,
  Select,
  Input,
  DatePicker,
  TreeSelect,
} from "antd";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
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
  defaultPaginationProperties,
  ISearch,
} from "../../../app/common/table/utils";
import { IStudyList } from "../../../app/models/study";
import { observer } from "mobx-react-lite";
import Study from "../../../app/api/study";
import SelectInput from "../../../app/common/form/SelectInput";
import CreationTrackingOrderTable from "./CreationTrackingOrderTable";
import moment from "moment";
import DateRangeInput from "../../../app/common/form/DateRangeInput";
import DateInput from "../../../app/common/form/proposal/DateInput";
import { IDias, IRouteForm, RouteFormValues } from "../../../app/models/route";
import { toJS } from "mobx";

type TrackingOrderFormProps = {
  id: number;
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
  } = trackingOrderStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<ITrackingOrderForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<ITrackingOrderForm>(
    new TrackingOrderFormValues()
  );

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
    const readTrackingOrder = async (id: number) => {
      setLoading(true);
      const trackingOrder = await getById(id);
      form.setFieldsValue(trackingOrder!);
      setValues(trackingOrder!);
      setLoading(false);
    };

    if (id) {
      readTrackingOrder(id);
    }
  }, [form, getById, id]);

  const dias: IDias[] = [
    { id: 1, dia: "L" },
    { id: 2, dia: "M" },
    { id: 3, dia: "M" },
    { id: 4, dia: "J" },
    { id: 5, dia: "V" },
    { id: 6, dia: "S" },
    { id: 7, dia: "D" },
  ];
  const routeFoundOptions = foundRoutes.map((route) => ({
    value: route.id,
    label: route.nombre,
  }));
  const initialSerachRoutes = async (initial = true) => {
    let formValues = form.getFieldsValue();
    formValues = { ...formValues };
    console.log("Tracking order: ", formValues);
    let routeForms: IRouteForm = new RouteFormValues();
    routeForms.horaDeRecoleccion = moment().hours() + 1;
    routeForms.sucursalOrigenId = formValues.sucursalOrigenId!;
    const parent = treeData.find((x) =>
      x.children.map((x) => x.value).includes(formValues.sucursalDestinoId!)
    );
    if (!initial) {
      if (parent?.title === "Sucursales") {
        console.log("sucursal");
        routeForms.sucursalDestinoId =
          formValues.sucursalDestinoId! === "sucursalDestinoId" ||
          formValues.sucursalDestinoId! === "maquiladorId"
            ? ""
            : formValues.sucursalDestinoId!;
      } else {
        console.log("maquilador");
        routeForms.maquiladorId =
          formValues.sucursalDestinoId! === "sucursalDestinoId" ||
          formValues.sucursalDestinoId! === "maquiladorId"
            ? ""
            : formValues.sucursalDestinoId!;
      }
    }
    routeForms.dias = dias.filter((x) => x.id === moment().day());
    console.log("formulario de envio", routeForms);

    await find(routeForms);
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
    console.log("values", values);
    console.log("newValues", newValues);
    const trackingOrderSend = { ...newTrackingOrder, ...newValues };
    let success = false;
    trackingOrderSend.sucursalDestinoId =
      "" + trackingOrderSend.sucursalDestinoId;
    trackingOrderSend.estudios = trackingOrder
      .filter((order) => order.escaneado)
      .map((order) => {
        return {
          clave: order.estudios.map((estudio) => estudio.clave).join(","),
          estudio: order.estudios.map((estudio) => estudio.estudio).join(","),
          solicitud: order.estudios.map((estudio) => estudio.solicitud)[0],
          paciente: order.estudios.map((estudio) => estudio.paciente)[0],
          escaneado: order.escaneado,
          temperatura: order.temperatura,
        };
      });
    console.log("trackingOrder", trackingOrderSend);
    success = await create(trackingOrderSend);
    // if (!trackingOrderSend.id) {
    //   success = await create(trackingOrderSend);
    // } else {
    //   success = await update(trackingOrderSend);
    // }

    if (success) {
      console.log("guardado");
      // navigate(`/tracking-order?search=${searchParams.get("search") ?? "all"}`);
    }
  };

  useEffect(() => {
    console.log("valores cambiantes", values);
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
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("#");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                console.log("formularioi", form.getFieldsValue());
                // form.submit();
              }}
            >
              Guardar recolección
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
            onValuesChange={(changes_values: any) => {
              const propertyForm = Object.keys(changes_values)[0];
              if (propertyForm == "temperatura") {
                setTemperature(changes_values[propertyForm]);
              }
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
              );
            }}
          >
            <Row>
              <Col md={6} sm={12} style={{ textAlign: "center" }}>
                <DateInput
                  formProps={{ label: "Día de recolección", name: "fecha" }}
                  style={{ marginBottom: 24 }}
                  required
                  readonly={readonly}
                  disabledDates={(current: moment.Moment) =>
                    current.isBefore(moment(), "day")
                  }
                />

                <TextInput
                  formProps={{
                    name: "muestraId",
                    label: "Muestra",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "center" }}>
                <Form.Item label="Destino" name="sucursalDestinoId">
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    treeData={treeData}
                    treeDefaultExpandAll
                    // onChange={initialSerachRoutes}

                    onSelect={(value: any, node: any) => {
                      console.log("valor", value);
                      console.log("nodo", node);

                      const parent = treeData.find((x) =>
                        x.children.map((x) => x.value).includes(value)
                      );
                      console.log("parent", parent);
                    }}
                  />
                </Form.Item>

                <SwitchInput
                  name="escaneo"
                  // onChange={(value) => {
                  //   if (value) {
                  //     alerts.info(messages.confirmations.enable);
                  //   } else {
                  //     alerts.info(messages.confirmations.disable);
                  //   }
                  // }}
                  label="Escaneo por código de barras"
                  readonly={readonly}
                  style={{ marginLeft: 58 }}
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "center" }}>
                <SelectInput
                  formProps={{
                    name: "sucursalOrigenId",
                    label: "Origen",
                  }}
                  required
                  readonly={true}
                  options={sucursales}
                />

                <TextInput
                  formProps={{
                    name: "temperatura",
                    label: "Temperatura",
                  }}
                  // type="number"
                  max={100}
                  required
                  // onChange={(value: any) => {
                  //   console.log("temepratura cambiada", value);
                  //   setTemperature(value);
                  // }}
                  readonly={false}
                />
              </Col>
              <Col md={6} sm={12} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    initialSerachRoutes(false);
                    // console.log("formularioi", form.getFieldsValue());
                  }}
                  style={{ marginBottom: 24 }}
                >
                  Buscar rutas
                </Button>
                <SelectInput
                  options={routeFoundOptions}
                  formProps={{
                    name: "ruta",
                    label: "Ruta",
                  }}
                  onChange={(value) => {
                    if (value) {
                      findStudiesByStudiesRoute(value);
                      form.setFieldValue("ruta", value);
                    }
                  }}
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>
          <Row style={{ marginBottom: 24 }}>
            {!readonly && (
              <Col
                md={id ? 12 : 24}
                sm={24}
                xs={12}
                style={{ textAlign: "center" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabled}
                  onClick={(e) => {
                    // e.preventDefault();
                    // console.log("formularioi", form.getFieldsValue());
                    form.submit();
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
              <CreationTrackingOrderTable
                componentRef={componentRef}
                printing={printing}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CreationTrackingOrderForm);
