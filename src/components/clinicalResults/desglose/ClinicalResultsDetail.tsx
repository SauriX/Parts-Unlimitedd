import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Spin,
  Table,
} from "antd";
import { observer } from "mobx-react-lite";
import { Typography } from "antd";
import useWindowDimensions from "../../../app/util/window";
import { IColumns } from "../../../app/common/table/utils";
import {
  IRequest,
  IRequestStudy,
  IRequestStudyInfo,
  RequestStudyInfoForm,
  RequestStudyValues,
} from "../../../app/models/request";
import { FC, Fragment, useEffect, useState } from "react";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { status } from "../../../app/util/catalogs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  ClinicResultsCaptureForm,
  IClinicResultCaptureForm,
  IClinicStudy,
} from "../../../app/models/clinicResults";
import { IOptions } from "../../../app/models/shared";
import TextInput from "../../../app/common/form/proposal/TextInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import moment from "moment";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { formItemLayout } from "../../../app/util/utils";
const { Text, Title } = Typography;

type ClinicalResultsDetailProps = {
  estudio: IRequestStudy;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: number;
  isMarked: boolean;
  printing: boolean;
};

const ClinicalResultsDetail: FC<ClinicalResultsDetailProps> = ({
  estudio,
  estudioId,
  paciente,
  medico,
  claveMedico,
  solicitud,
  isMarked,
  printing
}) => {
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );
  const [values, setValues] = useState<IClinicResultCaptureForm>(
    new ClinicResultsCaptureForm()
  );
  const [currentResult, setCurrentResult] =
    useState<IClinicResultCaptureForm>();
  const [loading, setLoading] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const { optionStore, clinicResultsStore } = useStore();
  const {
    getStudies,
    getRequestStudyById,
    updateStatusStudy,
    studies,
    createResults,
    updateResults,
    addSelectedStudy,
    removeSelectedStudy,
  } = clinicResultsStore;
  const { medicOptions, getMedicOptions, getUnitOptions, UnitOptions } =
    optionStore;
  const [form] = Form.useForm();

  const tipodeValorList: IOptions[] = [
    { value: 0, label: "Sin valor" },
    { value: 1, label: "Numérico" },
    { value: 2, label: "Numérico por sexo" },
    { value: 3, label: "Numérico por edad" },
    { value: 4, label: "Numérico por edad y sexo" },
    { value: 5, label: "Opción múltiple" },
    { value: 6, label: "Numérico con una columna" },
    { value: 7, label: "Texto" },
    { value: 8, label: "Párrafo" },
    { value: 9, label: "Etiqueta" },
    { value: 10, label: "Observación" },
  ];

  useEffect(() => {
    setCheckedPrint(isMarked);
    if (currentStudy.estatusId > status.requestStudy.capturado) {
      if (isMarked) {
        addSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
      } else {
        removeSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
      }
    }
  }, [isMarked]);

  useEffect(() => {
    console.log(studies.map((x) => x.parametros));
    const loadOptions = async () => {
      await getMedicOptions();
      await getStudies(solicitud.expedienteId, solicitud.solicitudId!);
    };
    loadOptions();
  }, []);

  useEffect(() => {
    const readdepartments = async () => {
      await getUnitOptions();
    };
    readdepartments();
  }, [getUnitOptions]);

  useEffect(() => {
    form.setFieldValue("dr", claveMedico);
  }, [claveMedico]);

  const loadInit = async () => {
    const cStudy = await getRequestStudyById(estudio.id!);
    setCurrentStudy(cStudy!);
    let captureResult = studies.find((x) => x.id == estudioId);
    form.setFieldValue("parametros", captureResult?.parametros);
    console.log(captureResult?.parametros.map((x) => x));
  };

  useEffect(() => {
    loadInit();
  }, [studies, estudio, estudioId]);

  useEffect(() => {
    setDisabled(
      !(
        estudio.estatusId === status.requestStudy.solicitado ||
        estudio.estatusId === status.requestStudy.capturado ||
        estudio.estatusId === status.requestStudy.validado ||
        estudio.estatusId === status.requestStudy.liberado ||
        estudio.estatusId === status.requestStudy.enviado
      )
    );
  }, [estudio]);

  const { width: windowWidth } = useWindowDimensions();
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave",
      align: "left",
      width: "20%",
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: "30%",
    },
    {
      key: "estatus",
      dataIndex: "estatus",
      title: "Estatus",
      align: "left",
      width: "15%",
      render: (value: any) => {
        return value.nombre;
      },
    },
    {
      key: "estatusId",
      dataIndex: "estatusId",
      title: "Fecha Actualización",
      align: "left",
      width: "15%",
      render: (value: any, fullRow: any) => {
        if (value === status.requestStudy.pendiente) {
          return moment(fullRow.fechaSolicitud).format("DD/MM/YYYY");
        }
        if (value === status.requestStudy.solicitado) {
          return moment(fullRow.fechaSolicitud).format("DD/MM/YYYY");
        }
        if (value === status.requestStudy.capturado) {
          return moment(fullRow.fechaCaptura).format("DD/MM/YYYY");
        }
        if (value === status.requestStudy.validado) {
          return moment(fullRow.fechaValidacion).format("DD/MM/YYYY");
        }
        if (value === status.requestStudy.liberado) {
          return moment(fullRow.fechaLiberacion).format("DD/MM/YYYY");
        }
        if (value === status.requestStudy.enviado) {
          return moment(fullRow.fechaEnvio).format("DD/MM/YYYY");
        }
        return "";
      },
    },

    {
      key: "Orden",
      dataIndex: "orden",
      title: "Orden",
      align: "left",
      width: "15%",
    },
    {
      key: "Seleccionar",
      dataIndex: "imprimir",
      title: "Seleccionar",
      align: "center",
      width: "20%",
      render: () => {
        return (
          <Checkbox
            checked={
              currentStudy.estatusId < status.requestStudy.capturado
                ? false
                : checkedPrint
            }
            disabled={currentStudy.estatusId < status.requestStudy.capturado}
            onChange={(value) => {
              if (value.target.checked) {
                addSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
                setCheckedPrint(true);
              } else {
                removeSelectedStudy({
                  id: currentStudy.id!,
                  tipo: "LABORATORY",
                });
                setCheckedPrint(false);
              }
            }}
          ></Checkbox>
        );
      },
    },
  ];

  const renderUpdateStatus = () => {
    return (
      <>
        {currentStudy.estatusId >= status.requestStudy.solicitado ? (
          <>
            <Divider></Divider>
            <Col span={4}>
              <Button
                type="default"
                htmlType="submit"
                disabled={
                  currentStudy.estatusId ===
                    status.requestStudy.tomaDeMuestra ||
                  currentStudy.estatusId === status.requestStudy.pendiente
                }
                onClick={async () => {
                  setLoading(true);
                  await updateStatus(true);
                  loadInit();
                  setLoading(false);
                }}
                danger
              >
                Cancelar{" "}
                {currentStudy.estatusId === status.requestStudy.capturado
                  ? "Captura"
                  : currentStudy.estatusId === status.requestStudy.validado
                  ? "Validación"
                  : currentStudy.estatusId === status.requestStudy.solicitado
                  ? "Solicitud"
                  : ""}
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={disabled}
                onClick={() => {
                  form.submit();
                }}
                style={{
                  backgroundColor: "#6EAA46",
                  color: "white",
                  borderColor: "#6EAA46",
                }}
              >
                {currentStudy.estatusId === status.requestStudy.capturado
                  ? "Validar"
                  : currentStudy.estatusId === status.requestStudy.validado
                  ? "Liberar"
                  : currentStudy.estatusId === status.requestStudy.solicitado
                  ? "Guardar captura"
                  : ""}
              </Button>
            </Col>
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  const onFinish = async (newValuesForm: any) => {
    setLoading(true);
    const labResults: IClinicResultCaptureForm[] = newValuesForm.parametros;
    let success = false;
    if (!!currentResult) {
      await updateResults(labResults);
    } else {
       await createResults(labResults);
    }
    await updateStatus();
    await loadInit();

    setLoading(false);
  };

  const updateStatus = async (esCancelacion: boolean = false) => {
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      await updateStatusStudy(currentStudy.id!, status.requestStudy.capturado);
      return status.requestStudy.capturado;
    }
    if (currentStudy.estatusId === status.requestStudy.capturado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.solicitado
        : status.requestStudy.validado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
      console.log(nuevoEstado);
      return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.validado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.capturado
        : status.requestStudy.liberado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
      return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.liberado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.validado
        : status.requestStudy.enviado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
      return nuevoEstado;
    }
  };

  const disableInput = () => {
    return currentStudy.estatusId > 3;
  };

  return (
    <Fragment>
      <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
        <Row style={{ marginBottom: "20px" }}>{renderUpdateStatus()}</Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <Table<any>
              size="small"
              rowKey={(record) => record.id}
              columns={columns}
              pagination={false}
              dataSource={[currentStudy]}
            />
          </Col>
        </Row>
        {currentStudy.estatusId >= 3 ? (
          <Card className="capture-details">
            <Form<IClinicResultCaptureForm>
              form={form}
              onFinish={onFinish}
              name="dynamic_form_item"
              onValuesChange={(changes_values: any) => {
                setDisabled(
                  !form.isFieldsTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                );
                form.setFieldValue("resultado", values.resultado);
              }}
            >
              <Row>
                <Col span={24}>
                  <Row justify="space-between" gutter={[0, 12]}>
                    <Col span={6}>
                      <h3>EXAMEN</h3>
                    </Col>
                    <Col span={6}>
                      <h3>RESULTADO</h3>
                    </Col>
                    <Col span={6}>
                      <h3>UNIDADES</h3>
                    </Col>
                    <Col span={6}>
                      <h3>REFERENCIA</h3>
                    </Col>
                  </Row>
                  <Row justify="space-between" gutter={[0, 12]}>
                    <Form.List name="parametros">
                      {(fields) => (
                        <>
                          {fields.map((field, index) => (
                            <Fragment key={field.key}>
                              <Col span={6}>
                                <h4>
                                  {form.getFieldValue([
                                    "parametros",
                                    field.name,
                                    "nombre",
                                  ])}
                                </h4>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "resultado"]}
                                  fieldKey={[field.key, "resultado"]}
                                  validateTrigger={["onChange", "onBlur"]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Resultado"
                                    style={{ width: "50%" }}
                                    disabled={disableInput()}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                {form.getFieldValue([
                                  "parametros",
                                  field.name,
                                  "unidadNombre",
                                ])}
                              </Col>
                              <Col span={6}>
                                {form.getFieldValue([
                                  "parametros",
                                  field.name,
                                  "valorInicial",
                                ])}
                              </Col>
                            </Fragment>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          ""
        )}
      </Spin>
    </Fragment>
  );
};
export default observer(ClinicalResultsDetail);
