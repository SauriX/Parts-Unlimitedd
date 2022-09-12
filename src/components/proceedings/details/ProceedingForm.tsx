import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Radio,
  DatePicker,
  List,
  Typography,
  Select,
  Table,
  Checkbox,
  Input,
  Tag,
  InputNumber,
  Tooltip,
  Card,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import { EditOutlined } from "@ant-design/icons";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
import DatosFiscalesForm from "./DatosFiscalesForm";
import Concidencias from "./Concidencias";
import {
  IProceedingForm,
  ISearchMedical,
  ProceedingFormValues,
} from "../../../app/models/Proceeding";
import moment, { Moment } from "moment";
import { ITaxData } from "../../../app/models/taxdata";
import DateInput from "../../../app/common/form/proposal/DateInput";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import IconButton from "../../../app/common/button/IconButton";
import { IQuotationList } from "../../../app/models/quotation";
import Link from "antd/lib/typography/Link";

type ProceedingFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const ProceedingForm: FC<ProceedingFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigate = useNavigate();
  const {
    modalStore,
    procedingStore,
    locationStore,
    optionStore,
    profileStore,
  } = useStore();
  const {
    getById,
    update,
    create,
    coincidencias,
    getnow,
    setTax,
    clearTax,
    expedientes,
    search,
    tax,
    activateWallet,
  } = procedingStore;
  const { profile } = profileStore;
  const { BranchOptions, getBranchOptions } = optionStore;
  const [loading, setLoading] = useState(false);
  const [monedero, setMonedero] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [form] = Form.useForm<IProceedingForm>();
  const [values, setValues] = useState<IProceedingForm>(
    new ProceedingFormValues()
  );
  const { getColoniesByZipCode } = locationStore;
  const { openModal, closeModal } = modalStore;
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [date, setDate] = useState(moment(new Date(moment.now())));
  const [continuar, SetContinuar] = useState<boolean>(true);
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.proceeding}?${searchParams}`);
    clearTax();
    closeModal();
  };

  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  };

  useEffect(() => {
    const readExpedinte = async (id: string) => {
      setLoading(true);
      var expediente = await getById(id);

      const location = await getColoniesByZipCode(expediente?.cp!);
      if (location) {
        setColonies(
          location.colonias.map((x) => ({
            value: x.id,
            label: x.nombre,
          }))
        );
      } else {
        clearLocation();
      }
      form.setFieldsValue({
        ...expediente!,
        fechaNacimiento: moment(expediente?.fechaNacimiento),
      });
      setTax(expediente?.taxData!);
      setValues(expediente!);
      setLoading(false);
    };

    if (id) {
      readExpedinte(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getById]);

  useEffect(() => {
    if (!profile?.admin) {
      form.setFieldsValue({ sucursal: profile?.sucursal });
    }
  });

  useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getnow(search);
    };

    readData(search);
  }, [search, getnow]);
  useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getBranchOptions();
    };

    readData(search);
  }, [getBranchOptions]);
  const setEditMode = () => {
    navigate(`/${views.proceeding}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const calcularEdad = (fecha: Moment) => {
    var hoy = new Date();
    var cumpleanos = fecha.toDate();
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    form.setFieldsValue({ edad: edad });
    return edad;
  };

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];
    if (field == "edad") {
      const edad = changedValues[field] as number;
      var hoy = new Date();
      var cumpleaños = hoy.getFullYear() - edad;
      hoy.setFullYear(cumpleaños);
      //setValues((prev) => ({ ...prev, fechaNacimiento: hoy }));
      form.setFieldsValue({ fechaNacimiento: moment(hoy) });
    }
    if (field == "fechaNacimiento") {
      const edad = changedValues[field];
      calcularEdad(edad);
    }
    if (field === "cp") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            municipio: location.ciudad,
          });
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          clearLocation();
        }
      } else {
        clearLocation();
      }
    }
  };

  const setPage = (page: number) => {
    const priceList = expedientes[page - 1];
    navigate(`/${views.proceeding}/${priceList.id}?${searchParams}`);
  };
  const getPage = (id: string) => {
    return expedientes.findIndex((x) => x.id === id) + 1;
  };
  const continues = async (cont: boolean) => {
    SetContinuar(cont);
  };
  const activarMonedero = async () => {
    // setMonedero(true);
    if (values.id) {
      setLoading(true);
      await activateWallet(values.id);
      setLoading(false);
    }
  };
  const onFinish = async (newValues: IProceedingForm) => {
    setLoading(true);
    var coincidencia = await coincidencias(newValues);
    const reagent = { ...values, ...newValues };
    if (coincidencia.length > 0 && !reagent.id!) {
      openModal({
        title: "Se encuentran coincidencias con los siguientes expedientes",
        body: (
          <Concidencias
            handle={async () => {
              let success = false;
              tax.forEach((x) => {
                if (x.id.includes("tempId")) {
                  x.id = "";
                }
                return x;
              });
              console.log(tax);
              reagent.taxData = tax;

              if (!reagent.id) {
                success = await create(reagent);
              } else {
                success = await update(reagent);
              }
              setLoading(false);
              if (success) {
                goBack();
              }
            }}
            expedientes={coincidencia}
            handleclose={async () => {
              setLoading(false);
            }}
            printing={false}
          ></Concidencias>
        ),
        closable: true,
        width: "55%",
      });
    } else {
      let success = false;
      reagent.taxData = tax;
      if (!reagent.id) {
        success = await create(reagent);
      } else {
        success = await update(reagent);
      }
      setLoading(false);
      if (success) {
        goBack();
      }
    }
  };

  const handleChangeTax = (tax: ITaxData[]) => {
    setTax(tax);
  };

  const addRequest = () => {
    navigate(`/${views.request}/${id}`);
  };
  const columnsP: IColumns<IQuotationList> = [
    {
      ...getDefaultColumnProps("presupuesto", "Presupuesto", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, cotizacion) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/${views.quotatiion}/${cotizacion.id}?${searchParams}&mode=readonly`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nomprePaciente", "Nombre del paciente", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        width: 150,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("email", "Email", {
        width: 150,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("whatsapp", "Whatsapp", {
        width: 100,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },

    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        width: 100,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },

    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: 200,
      render: (value, cotizacion) => (
        <IconButton
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/${views.quotatiion}/${cotizacion.id}?${searchParams}&mode=edit`
            );
          }}
        />
      ),
    },
  ];

  const columns: IColumns<any> = [
    {
      ...getDefaultColumnProps("clave", "Solicitud", {
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, maquilador) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/maquila/${maquilador.id}?${searchParams}&mode=readonly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Unidad", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("direccion", "Compañia", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Fact", {
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Total", {
        width: "14%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Saldo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Tipo solicitud",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Estudios",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (
        <IconButton
          title="Editar Maquilador"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/maquila/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
  ];
  const columnsC: IColumns<any> = [
    {
      ...getDefaultColumnProps("noSolicitud", "Solicitud de cita", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => (
        <Link
        /*           draggable
          onDragStart={() => {
            SetCita(item);
          }} */
        >
          {value}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      ...getDefaultColumnProps("direccion", "Dirección", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => <Tooltip title={value}>{value}</Tooltip>,
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("info", "Datos", {
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (_, data) => (
        <div>{`${data.edad} años, ${data.sexo.substring(0, 1)}`}</div>
      ),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar reactivo"
          icon={<EditOutlined />}
          onClick={() => {
            // navigate(`/${views.appointment}/${value}?type=${tipo}&mode=edit`);
          }}
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={expedientes?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={goBack}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Expediente" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IProceedingForm>
            {...formItemLayout}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            form={form}
            size="small"
            onFinishFailed={(error) => {
              console.log(error);
            }}
          >
            <Row gutter={[0, 12]}>
              <Col span={12}>
                <Form.Item
                  label="Nombre"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  className="no-error-text"
                  help=""
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "nombre",
                            label: "Nombre(s)",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "apellido",
                            label: "Apellido(s)",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "E-Mail",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  max={500}
                  type="email"
                />
              </Col>
              <Col span={4}>
                <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Exp",
                  }}
                  max={500}
                  readonly={true}
                />
              </Col>
              <Col span={4}>
                <SelectInput
                  formProps={{
                    name: "sexo",
                    label: "Sexo",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                  options={[
                    { label: "F", value: "F" },
                    { label: "M", value: "M" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <DateInput
                  formProps={{
                    name: "fechaNacimiento",
                    label: "Fecha Nacimiento",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                />
              </Col>
              <Col span={4}>
                <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                  max={500}
                  min={0}
                  suffix={"años"}
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Contacto"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  help=""
                  className="no-error-text"
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "telefono",
                            label: "Teléfono",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "celular",
                            label: "Celular",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Dirección"
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 22 }}
                  help=""
                  className="no-error-text"
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={2}>
                        <TextInput
                          formProps={{
                            name: "cp",
                            label: "CP",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                      <Col span={4}>
                        <TextInput
                          formProps={{
                            name: "estado",
                            label: "Estado",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                      <Col span={5}>
                        <TextInput
                          formProps={{
                            name: "municipio",
                            label: "Municipio",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                      <Col span={6}>
                        <SelectInput
                          formProps={{
                            name: "colonia",
                            label: "Colonia",
                            noStyle: true,
                          }}
                          showLabel
                          options={colonies}
                        />
                      </Col>
                      <Col span={7}>
                        <TextInput
                          formProps={{
                            name: "calle",
                            label: "Calle",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={16} style={{ textAlign: "end" }}>
                <Button
                  onClick={() =>
                    openModal({
                      title: "Seleccionar o Ingresar Datos Fiscales",
                      body: <DatosFiscalesForm />,
                      width: 900,
                    })
                  }
                  style={{
                    backgroundColor: "#6EAA46",
                    color: "white",
                    borderColor: "#6EAA46",
                  }}
                >
                  Datos Fiscales
                </Button>
              </Col>
              <Col span={8}>
                <SelectInput
                  formProps={{
                    name: "sucursal",
                    label: "Sucursal",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  options={BranchOptions}
                  required
                />
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={6}>
              <Button
                style={{
                  marginTop: "20px",
                  marginLeft: "70%",
                  marginBottom: "20px",
                }}
                onClick={() => {
                  navigate(`/requests/${id}`);
                }}
                type="primary"
              >
                {" "}
                Agregar solicitud
              </Button>
            </Col>
            <Col span={6}>
              <Button
                style={{
                  marginTop: "20px",
                  marginLeft: "70%",
                  marginBottom: "20px",
                }}
                onClick={() => {
                  navigate(`/cotizacion/new?&mode=edit&exp=${id}`);
                }}
                type="primary"
              >
                {" "}
                Agregar cotización
              </Button>
            </Col>
            <Col span={6}>
              <Button
                style={{
                  marginTop: "20px",
                  marginLeft: "70%",
                  marginBottom: "20px",
                }}
                onClick={() => {
                  navigate(`/appointments`);
                }}
                type="primary"
              >
                {" "}
                Agregar cita
              </Button>
            </Col>
            <Col span={6}>
              {values.hasWallet ? (
                <Card
                  style={{
                    marginTop: "20px",
                    marginLeft: "10%",
                    marginBottom: "20px",
                  }}
                  bodyStyle={{
                    backgroundColor: "rgba(255, 255, 0, 1)",
                    border: 0,
                  }}
                >
                  <p>Monedero Electronico: {values.wallet}</p>
                </Card>
              ) : (
                ""
              )}
              <Button
                style={{
                  marginTop: "20px",
                  marginLeft: "30%",
                  marginBottom: "20px",
                }}
                onClick={() => {
                  activarMonedero();
                }}
                type="primary"
                disabled={values.hasWallet}
              >
                Activar monedero
              </Button>
            </Col>
          </Row>
          <Divider orientation="left">Solicitud</Divider>
          <Table<any>
            loading={loading || printing}
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={[]}
            /*    pagination={defaultPaginationProperties} */
            sticky
            scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
          />
          <Divider orientation="left">Presupuestos</Divider>
          <Table<any>
            loading={loading || printing}
            size="small"
            rowKey={(record) => record.id}
            columns={columnsP}
            dataSource={[]}
            /*    pagination={defaultPaginationProperties} */
            sticky
            scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
          />
          <Divider orientation="left">Cita</Divider>
          <Table<any>
            loading={loading || printing}
            size="small"
            rowKey={(record) => record.id}
            columns={columnsC}
            dataSource={[]}
            /*    pagination={defaultPaginationProperties} */
            sticky
            scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default observer(ProceedingForm);
