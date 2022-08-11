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
  Tabs,
  Descriptions,
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
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import DateInput from "../../../app/common/form/proposal/DateInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../app/models/shared";
import moment from "moment";
import { ITaxData } from "../../../app/models/taxdata";
import GeneralesForm from "./TapsComponents/Generales";
import ExpedientesForm from "./TapsComponents/Estudios";
import IndiciacionesForm from "./TapsComponents/Indicaciones";
import BusquedaForm from "./TapsComponents/Busqueda";
import {
  IQuotationForm,
  IQuotationGeneralesForm,
  IQuotationPrice,
  QuotationFormValues,
  ISolicitud,
} from "../../../app/models/quotation";
import { IProceedingList } from "../../../app/models/Proceeding";
import { IRequestStudy } from "../../../app/models/request";
import { sum } from "lodash";
import { IParameterList } from "../../../app/models/parameter";
import { type } from "os";
type QuotationFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const QuotationForm: FC<QuotationFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const navigate = useNavigate();
  const {
    modalStore,
    locationStore,
    optionStore,
    profileStore,
    quotationStore,
    priceListStore,
  } = useStore();
  const {
    getById,
    update,
    create,
    search,
    createsolictud,
    getAll,
    quotatios,
    printTicket,
  } = quotationStore;
  const [data, setData] = useState<IRequestStudy[]>([]);
  const { profile } = profileStore;
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [form] = Form.useForm<IQuotationForm>();
  const [values, setValues] = useState<IQuotationForm>(
    new QuotationFormValues()
  );
  const { getColoniesByZipCode } = locationStore;
  const { openModal, closeModal } = modalStore;
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [date, setDate] = useState(moment(new Date(moment.now())));
  const [continuar, SetContinuar] = useState<boolean>(true);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [generales, setGenerales] = useState<IQuotationGeneralesForm>();
  const [generalesSumbit, setGeneralesSumbit] = useState(false);
  const [record, Setrecord] = useState<IProceedingList>();
  const [total, SetTotal] = useState<number>(0);
  const [totalFinal, SetTotalFinal] = useState<number>();
  const [cargo, SetCargo] = useState<number>();
  const [typo, SetTypo] = useState<number>(1);
  const { TabPane } = Tabs;
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.quotatiion}?${searchParams}`);
    closeModal();
  };

  useEffect(() => {
    console.log(values, "values");
    form.setFieldsValue(values!);
  }, [values]);

  useEffect(() => {
    const read = async () => {
      await getAll(search);
    };
    if (id) {
      read();
    }
  }, [getAll]);

  /*   const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  }; */

  const setTipo = (tipo: number, carg: number) => {
    SetTypo(tipo);
    calculateTotalFinal(carg!, tipo);
  };
  const calculateTotalFinal = (carg: number, tipo: number) => {
    if (tipo == 2) {
      var totalfinal = total! + carg!;
      SetTotalFinal(totalfinal);
    }
    if (tipo == 1) {
      var porcent = (total! * carg!) / 100;
      var totalfinal = total! + porcent;
      SetTotalFinal(totalfinal);
    }
  };
  const convertSolicitud = () => {
    var request: ISolicitud = {
      Id: values.id,
      ExpedienteId: values.expedienteid!,
      SucursalId: profile?.sucursal!,
      Clave: values.nomprePaciente,
      ClavePatologica: "",
      UsuarioId: "00000000-0000-0000-0000-000000000000",
      General: {
        solicitudId: "00000000-0000-0000-0000-000000000000",
        expedienteId: values.expedienteid!,
        procedencia: 0,
        compañiaId: values.generales?.compañia!,
        medicoId: values.generales?.medico!,
        afiliacion: "",
        urgencia: 0,
        metodoEnvio: [],
        correo: values.generales?.email!,
        whatsapp: values.generales?.whatssap!,
        observaciones: values.generales?.observaciones!,
      },
      Estudios: values.estudy!,
    };
    var redirect = createsolictud(request);
    navigate(`/${views.quotatiion}/${redirect}?${searchParams}`);
  };
  useEffect(() => {
    var suma = 0;
    data.forEach((x) => {
      suma += x.precioFinal;
    });

    SetTotal(suma);
  }, [data]);
  useEffect(() => {
    form.setFieldsValue({sucursalId:profile?.sucursal});
    const readExpedinte = async (id: string) => {
      setLoading(true);
      var expediente = await getById(id);

      var suma = 0;
      expediente!.estudy!.forEach((x) => {
        suma += x.precioFinal;
      });

      SetTotal(suma);
      setGenerales(expediente?.generales);
      console.log(expediente, "expediente");
      form.setFieldsValue(expediente!);
      setValues(expediente!);
      console.log(expediente?.estudy!, "estudys");
      setData(expediente?.estudy!);
      SetCargo(expediente?.cargo!);
      SetTypo(expediente?.typo!);

      calculateTotalFinal(expediente?.cargo!, expediente?.typo!);
      setLoading(false);
    };

    if (id) {
      readExpedinte(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getById]);

  /*    useEffect(()=>{
    if(!profile?.admin){
      form.setFieldsValue({sucursal:profile?.sucursal});
    }
    
  }); */

  const setEditMode = () => {
    navigate(`/${views.proceeding}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const { Text } = Typography;
  const calcularEdad = (fecha: Date) => {
    var hoy = new Date();
    var cumpleanos = fecha;
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
      const edad = changedValues[field];
      var hoy = new Date();
      var cumpleaños = hoy.getFullYear() - edad;
      hoy.setFullYear(cumpleaños);
      form.setFieldsValue({ edad: edad, fechaNacimiento:moment(hoy) });
     
    }
    if (field == "fechaNacimiento") {
      const edad = changedValues[field];
      calcularEdad(edad);
    }
    if (field === "cp") {
      const zipCode = changedValues[field];

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          /*          form.setFieldsValue({
            estado: location.estado,
            municipio: location.ciudad,
          }); */
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          /* clearLocation(); */
        }
      } else {
        /* clearLocation(); */
      }
    }
  };
  const parametrosDuplicados = (estudios: IRequestStudy[]) => {
    let duplicados = [];
    var temparray: IParameterList[] = [];
    estudios.forEach((x) => x.parametros.forEach((x) => temparray.push(x)));
    temparray = temparray.sort();
    for (let i = 0; i < temparray.length; i++) {
      if (temparray[i + 1] === temparray[i]) {
        duplicados.push(temparray[i]);
      }
    }

    return duplicados;
  };
  const setPage = (page: number) => {
    const priceList = quotatios[page - 1];
    navigate(`/${views.quotatiion}/${priceList.id}?${searchParams}`);
  };
  const getPage = (id: string) => {
    return quotatios.findIndex((x) => x.id === id) + 1;
  };
  const continues = async (cont: boolean) => {
    SetContinuar(cont);
  };

  const onFinish = async (newValues: IQuotationForm) => {
    setLoading(true);
    console.log(generales, "genreales");
    const reagent = { ...values, ...newValues };
    if (data.length <= 0) {
      alerts.warning(`La cotización debe tener un estudio o paquete`);
      setLoading(false);
      return;
    }

    let success = false;
    reagent.generales = generales;
    reagent.expediente = record?.expediente!;
    reagent.estudy = data;
    reagent.typo = typo;
    reagent.cargo = cargo;
    reagent.sucursalId = profile?.sucursal;
    console.log(reagent, "reagent");

    var duplicados = parametrosDuplicados(reagent.estudy);
    if (duplicados.length > 0) {
      duplicados.forEach((x) =>
        alerts.warning(`El parametro ${x.nombre} sse Encuentra duplicado`)
      );
      setLoading(false);
      return;
    }

    if (!reagent.id) {
      console.log("succes");
      success = await create(reagent);
    } else {
      success = await update(reagent);
    }
    setLoading(false);
    if (success) {
      goBack();
    }
  };
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={quotatios.length ?? 0}
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
              title={<HeaderTitle title="Catálogo de Cotizaciones" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IQuotationForm>
            {...formItemLayout}
            form={form}
            name="quotation"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
            style={{ marginBottom: "10px" }}
            onFinishFailed={({ errorFields }) => {
              const errors = errorFields.map((x) => ({
                name: x.name[0].toString(),
                errors: x.errors,
              }));
              setErrors(errors);
            }}
            size="small"
          >
            <Row gutter={[0, 12]}>
              <Col md={8} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nomprePaciente",
                    label: "Nombre(s)",
                  }}
                  width="small"
                  max={500}
                  showLabel
                  readonly={readonly}
                  errors={
                    errors.find((x) => x.name === "nomprePaciente")?.errors
                  }
                />
              </Col>
              <Col md={8} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Expediente",
                  }}
                  width="small"
                  max={500}
                  showLabel
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "expediente")?.errors}
                />
              </Col>
              <Col md={8} sm={24} xs={12}>
                <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                  }}
                  width="small"
                  min={0}
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "edad")?.errors}
                ></NumberInput>
              </Col>
              <Col md={8} sm={24} xs={12}>
                <DateInput
                  formProps={{
                    name: "fechaNacimiento",
                    label: "Fecha de Nacimiento",
                    labelCol: { span: 10 },
                  }}
                  errors={
                    errors.find((x) => x.name === "fechaNacimiento")?.errors
                  }
                />
              </Col>

              <Col span={8}>
                <SelectInput
                  formProps={{
                    name: "genero",
                    label: "Género",
                  }}
                  options={[
                    { value: "M", label: "M" },
                    { value: "F", label: "F" },
                  ]}
                ></SelectInput>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col md={17} sm={24} xs={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Generales" key="1">
                  <GeneralesForm
                    data={generales}
                    generales={setGenerales}
                    handle={generalesSumbit}
                    printing={loading}
                    branchId={values.sucursalId}
                  ></GeneralesForm>
                </TabPane>
                <TabPane tab="Estudios" key="2">
                  <ExpedientesForm
                    setTotal={SetTotal}
                    total={total!}
                    data={data}
                    setData={setData}
                  ></ExpedientesForm>
                </TabPane>
                <TabPane tab="Indicaciones" key="3">
                  {/* <IndiciacionesForm data={data} clave={""}></IndiciacionesForm> */}
                  <IndiciacionesForm data={[]} clave={""}></IndiciacionesForm>
                </TabPane>
                <TabPane tab="Búsqueda" key="4">
                  <BusquedaForm
                    handleCotizacion={setValues}
                    handleIdExpediente={Setrecord}
                    printing={loading}
                  ></BusquedaForm>
                </TabPane>
              </Tabs>
            </Col>
            <Col offset={1} md={6} sm={24} xs={12}>
              {id && (
                <Button
                  style={{
                    marginTop: "10px",
                    marginLeft: "80px",
                    backgroundColor: "#B4C7E7",
                    color: "white",
                  }}
                  onClick={() => {
                    convertSolicitud();
                  }}
                >
                  Convertir a solicitud
                </Button>
              )}
              {!id && <br />}
              <br />
              <Descriptions
                labelStyle={{ width: "50%", marginLeft: "50px" }}
                className="request-description"
                bordered
                column={1}
                size="small"
              >
                <Descriptions.Item label="">Costos</Descriptions.Item>

                <Descriptions.Item label="Total">$ {total}</Descriptions.Item>
                <Descriptions.Item
                  label={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Cargo</Text>

                      <Radio
                        value={1}
                        checked={typo == 1}
                        onChange={(value) => {
                          setTipo(value.target.value, cargo!);
                        }}
                      >
                        %
                      </Radio>
                      <Radio
                        value={2}
                        checked={typo == 2}
                        onChange={(value) => {
                          setTipo(value.target.value, cargo!);
                        }}
                      >
                        $
                      </Radio>
                    </div>
                  }
                >
                  <InputNumber
                    min={0}
                    max={typo == 1 ? 100 : total}
                    value={cargo}
                    onChange={(value) => {
                      SetCargo(value);
                      calculateTotalFinal(value, typo);
                    }}
                  ></InputNumber>
                </Descriptions.Item>
                <Descriptions.Item label="Total">
                  $ {totalFinal}
                </Descriptions.Item>
              </Descriptions>
              <Button
                style={{
                  marginTop: "10px",
                  marginLeft: "100px",
                  backgroundColor: "#B4C7E7",
                  color: "white",
                }}
                onClick={async () => {
                  await printTicket();
                }}
              >
                Imprimir
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(QuotationForm);
