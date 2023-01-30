import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Row,
  Table,
  Upload,
  UploadFile,
} from "antd";
import { observer } from "mobx-react-lite";
import { Typography } from "antd";
import useWindowDimensions from "../../../app/util/window";
import { IColumns } from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/SelectInput";
import {
  IRequest,
  IRequestStudy,
  IRequestStudyInfo,
  RequestStudyInfoForm,
  RequestStudyValues,
} from "../../../app/models/request";
import { FC, useEffect, useState } from "react";
import { toJS } from "mobx";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { status, statusName } from "../../../app/util/catalogs";
import moment from "moment";
import TextInput from "../../../app/common/form/TextInput";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import {
  IResultPathological,
  ResultPathologicalValues,
} from "../../../app/models/clinicResults";
import { objectToFormData, toolBarOptions } from "../../../app/util/utils";
import { RcFile } from "antd/lib/upload";
import { uniqueId, values } from "lodash";
import alerts from "../../../app/util/alerts";
const { Text, Title } = Typography;
type ClinicalResultsFormProps = {
  estudio: IRequestStudy;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: number;
  isMarked: boolean;
  showHeaderTable: boolean;
};
const baseUrl =
  process.env.REACT_APP_MEDICAL_RECORD_URL + "/images/ResultsPathological";
const ClinicalResultsForm: FC<ClinicalResultsFormProps> = ({
  estudio,
  estudioId,
  paciente,
  medico,
  claveMedico,
  solicitud,
  isMarked,
  showHeaderTable,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [envioManual, setEnvioManual] = useState<boolean>(false);
  const [prueba, setPrueba] = useState<UploadFile[]>([]);
  const [editorMacroscopica, setEditorMacroscopica] = useState<any>(
    EditorState.createEmpty()
  );
  const [editorMicroscopica, setEditorMicroscopica] = useState<any>(
    EditorState.createEmpty()
  );
  const [loading, setLoading] = useState(false);
  const [editorDiagnostico, setEditorDiagnostico] = useState<any>(
    EditorState.createEmpty()
  );
  const [currentResult, setCurrentResult] = useState<IResultPathological>();
  const [checkedPrint, setCheckedPrint] = useState(false);
  const { optionStore, clinicResultsStore, requestStore } = useStore();
  const {
    createResultPathological,
    updateResultPathological,
    getResultPathological,
    getRequestStudyById,
    updateStatusStudy,
    addSelectedStudy,
    removeSelectedStudy,
    clearSelectedStudies,
  } = clinicResultsStore;
  const { request } = requestStore;
  const { medicOptions, getMedicOptions } = optionStore;
  const [form] = Form.useForm();

  useEffect(() => {
    clearSelectedStudies();
  }, []);

  useEffect(() => {
    const loadOptions = async () => {
      await getMedicOptions();
    };
    loadOptions();
  }, []);
  useEffect(() => {
    form.setFieldValue("dr", claveMedico);
  }, [claveMedico]);
  useEffect(() => {
    setCheckedPrint(isMarked);
    if (currentStudy.estatusId >= status.requestStudy.capturado) {
      if (isMarked) {
        addSelectedStudy({ id: currentStudy.id!, tipo: "PATHOLOGICAL" });
      } else {
        removeSelectedStudy({ id: currentStudy.id!, tipo: "PATHOLOGICAL" });
      }
    }
  }, [isMarked]);

  const loadInit = async () => {
    let resultPathological = await getResultPathological(estudio.id!);
    if (resultPathological === null) {
      resultPathological = new ResultPathologicalValues();
    }
    let archivos: RcFile[] = [];
    const cStudy = await getRequestStudyById(estudio.id!);
    console.log("estudio encontrado", toJS(cStudy));
    setCurrentStudy(cStudy!);
    if (
      resultPathological?.imagenPatologica !== null &&
      resultPathological?.imagenPatologica !== ""
    ) {
      archivos = resultPathological?.imagenPatologica
        .split(",")
        .map((str: any) => {
          return {
            uid: uniqueId(),
            name: str,
            status: "done", // custom error message to show
            url: `${baseUrl}/${estudio.id}/${str}`,
          };
        });
    }
    setPrueba(archivos);
    form.setFieldsValue(resultPathological);
    setCurrentResult(resultPathological);
  };

  useEffect(() => {
    loadInit();
  }, []);

  useEffect(() => {
    if (currentResult) {
      console.log(
        "result actual",
        JSON.parse(currentResult?.descripcionMacroscopica)
      );
      setEditorMacroscopica(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(currentResult.descripcionMacroscopica))
        )
      );
      setEditorMicroscopica(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(currentResult.descripcionMicroscopica))
        )
      );
      setEditorDiagnostico(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(currentResult.diagnostico))
        )
      );
    }
  }, [currentResult]);
  useEffect(() => {
    // console.log("PRUEBA TEST", prueba);
  }, [prueba]);

  useEffect(() => {
    setDisabled(!(currentStudy.estatusId === status.requestStudy.solicitado));
    console.log("CURRENT STUDY", toJS(currentStudy));
  }, [estudio, currentStudy]);

  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave",
      align: "left",
      width: "20%",
      render: () => {
        return <strong>{estudio.areaId === 30 ? "HP" : "CITO"}</strong>;
      },
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: "30%",
      render: () => {
        return (
          <strong>
            {estudio.areaId === 30 ? "HISTOPATOLOGÍA" : "CITOLOGÍA"}
          </strong>
        );
      },
    },
    {
      key: "id",
      dataIndex: "acciones",
      title: "Acciones",
      align: "center",
      width: "20%",
      render: () => renderUpdateStatus(),
    },
    {
      key: "Orden",
      dataIndex: "orden",
      title: "Orden",
      align: "left",
      width: "15%",
      render: (value) => {
        return <strong>{value}</strong>;
      },
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
                addSelectedStudy({
                  id: currentStudy.id!,
                  tipo: "PATHOLOGICAL",
                });
                setCheckedPrint(true);
              } else {
                removeSelectedStudy({
                  id: currentStudy.id!,
                  tipo: "PATHOLOGICAL",
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
        {currentStudy.estatusId >= status.requestStudy.solicitado &&
        currentStudy.estatusId <= status.requestStudy.liberado ? (
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[12, 24]}>
                {currentStudy.estatusId <= 3 ? (
                  ""
                ) : (
                  <Col span={8}>
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
                        setLoading(false);
                      }}
                      danger
                    >
                      Cancelar{" "}
                      {currentStudy.estatusId === status.requestStudy.capturado
                        ? "Captura"
                        : currentStudy.estatusId ===
                          status.requestStudy.validado
                        ? "Validación"
                        : ""}
                    </Button>
                  </Col>
                )}
                <Col span={8}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // disabled={disabled}
                    onClick={() => {
                      setEnvioManual(false);
                      form.submit();
                    }}
                    style={{
                      backgroundColor: "#6EAA46",
                      color: "white",
                      borderColor: "#6EAA46",
                    }}
                  >
                    {currentStudy.estatusId === status.requestStudy.capturado
                      ? "Validar Estudio"
                      : currentStudy.estatusId === status.requestStudy.validado
                      ? "Liberar Estudio"
                      : currentStudy.estatusId ===
                        status.requestStudy.solicitado
                      ? "Guardar Captura"
                      : ""}
                  </Button>
                </Col>
                {currentStudy.estatusId === status.requestStudy.liberado ? (
                  <Col span={8}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      // disabled={disabled}
                      onClick={() => {
                        if (request?.saldoPendiente) {
                          alerts.confirm(
                            "Solicitud con saldo pendiente",
                            "¿Esta seguro que desea enviar el resultado?",
                            async () => {
                              setEnvioManual(true);
                              form.submit();
                            },
                            () => console.log("do nothing")
                          );
                        } else {
                          setEnvioManual(true);
                          form.submit();
                        }
                        // setEnvioManual(true);
                        // form.submit();
                      }}
                      style={{
                        backgroundColor: "#6EAA46",
                        color: "white",
                        borderColor: "#6EAA46",
                      }}
                    >
                      Envio Manual
                    </Button>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            </Col>
          </Row>
        ) : (
          ""
        )}
      </>
    );
  };
  const guardarReporte = async (values: any) => {
    console.log("medicos options", medicOptions);
    const reporteClinico: IResultPathological = {
      solicitudId: solicitud.solicitudId!,
      estudioId: estudio.id!,
      requestStudyId: estudio.id!,
      descripcionMacroscopica: JSON.stringify(
        convertToRaw(editorMacroscopica.getCurrentContent())
      ),
      descripcionMicroscopica: JSON.stringify(
        convertToRaw(editorMicroscopica.getCurrentContent())
      ),
      diagnostico: JSON.stringify(
        convertToRaw(editorDiagnostico.getCurrentContent())
      ),
      muestraRecibida: values.muestraRecibida,
      medicoId: values.medicoId,
      imagenPatologica: prueba,
      listaImagenesCargadas: deletedFiles,
      estatus: (await updateStatus()) ?? 0,
      departamentoEstudio:
        estudio.areaId === 30 ? "HISTOPATOLÓGICO" : "CITOLÓGICO",
    };

    const formData = objectToFormData(reporteClinico);

    console.log("resultado actual", toJS(currentResult));
    if (!!currentResult) {
      await updateResultPathological(formData, envioManual);
    } else {
      await createResultPathological(formData);
    }
    await loadInit();
    console.log("reporte", reporteClinico);
    console.log("final form", values);
  };
  const updateStatus = async (esCancelacion: boolean = false) => {
    let nuevoEstado = 0;
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      // await updateStatusStudy(currentStudy.id!, status.requestStudy.capturado);
      return status.requestStudy.capturado;
    }
    if (currentStudy.estatusId === status.requestStudy.capturado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.solicitado
        : status.requestStudy.validado;

      // return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.validado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.capturado
        : status.requestStudy.liberado;
      // await updateStatusStudy(currentStudy.id!, nuevoEstado);
      // return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.liberado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.validado
        : status.requestStudy.enviado;
      // await updateStatusStudy(currentStudy.id!, nuevoEstado);
      // return nuevoEstado;
    }
    if (esCancelacion) {
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
    }
    return nuevoEstado;
  };
  const removeTestFile = (file: any) => {
    const index = prueba.indexOf(file);
    const newFileList = prueba.slice();
    setDeletedFiles((x) => [...x, prueba[index].name!]);
    newFileList.splice(index, 1);
    setPrueba(newFileList);
  };
  const beforeUploadTest = (value: any) => {
    console.log("before PRUEBA", value);
    setPrueba((x) => [...x, value]);
    return false;
  };

  return (
    <>
      <Row style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <p>
            CAP -{" "}
            {currentStudy.estatusId >= 4 && (
              <strong>{`${moment(currentStudy.fechaCaptura).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioCaptura}`}</strong>
            )}
          </p>
        </Col>
        <Col span={8}>
          <p>
            LIB -{" "}
            {currentStudy.estatusId >= 6 && (
              <strong>{`${moment(currentStudy.fechaLiberado).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioLiberado}`}</strong>
            )}
          </p>
        </Col>
        <Col span={8}>
          <p>
            IMP -
            {currentStudy.estatusId >= 8 && (
              <strong>{`${moment(currentStudy.fechaValidacion).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioValidacion
                ?.split(" ")
                .map((word: string) => word[0])
                .join("")}`}</strong>
            )}
          </p>
        </Col>
        <Col span={8}>
          <p>
            VAL -{" "}
            {currentStudy.estatusId >= 5 && (
              <strong>{`${moment(currentStudy.fechaValidacion).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioValidacion}`}</strong>
            )}
          </p>
        </Col>
        <Col span={8}>
          <p>
            ENV -{" "}
            {currentStudy.estatusId >= 7 && (
              <strong>{`${moment(currentStudy.fechaValidacion).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioValidacion}`}</strong>
            )}
          </p>
        </Col>
        <Col span={8}>
          <p>
            ENT -{" "}
            {currentStudy.estatusId >= 8 && (
              <strong>{`${moment(currentStudy.fechaValidacion).format(
                "DD/MM/YYYY HH:mm"
              )}, ${currentStudy.usuarioValidacion}`}</strong>
            )}
          </p>
        </Col>
        <Col span={24}>
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={[currentStudy]}
            showHeader={showHeaderTable}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card className="capture-observartions">
            <Form
              form={form}
              initialValues={currentResult}
              onFinish={guardarReporte}
              onValuesChange={(changes_values: any) => {
                setDisabled(
                  !form.isFieldsTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                );
              }}
            >
              <Row justify="space-between" gutter={[2, 12]}>
                <Col span={8}>
                  <Text key="expediente">
                    Médico: <Text strong>{medico}</Text>
                  </Text>
                </Col>
                <Col span={8}>
                  <Text key="expediente">
                    Fecha: <Text strong>{moment().format("LL")}</Text>
                  </Text>
                </Col>
              </Row>
              <Row justify="space-between" gutter={[2, 12]}>
                <Col span={8}>
                  <Text key="expediente">
                    Paciente: <Text strong>{paciente.nombre}</Text>
                  </Text>
                </Col>
                <Col span={8}>
                  <Text key="expediente">
                    Edad: <Text strong>{paciente.edad} años.</Text>
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text key="expediente">
                    {/* Estudio: <Text strong>{currentStudy.nombre}</Text> */}
                    Estudio:{" "}
                    <Text strong>
                      {estudio.areaId === 30 ? "HISTOPATOLOGÍA" : "CITOLOGÍA"}
                    </Text>
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text key="expediente">
                    {/* Clave: <Text strong>{estudio.clave}</Text> */}
                    Clave:{" "}
                    <Text strong>{estudio.areaId === 30 ? "HP" : "CITO"}</Text>
                  </Text>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={6}>
                  <Title level={5}>
                    REPORTE DE ESTUDIO
                    {estudio.areaId === 30
                      ? " HISTOPATOLÓGICO "
                      : " CITOLÓGICO "}
                    {currentStudy.id}
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <Text key="expediente">Muestra recibida:</Text>
                </Col>
                <Col span={5}>
                  <TextInput
                    formProps={{ name: "muestraRecibida" }}
                    readonly={disabled}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Text key="expediente">DESCRIPCIÓN MACROSCÓPICA</Text>
                  <Col span={24}>
                    <Editor
                      editorState={editorMacroscopica}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      onEditorStateChange={setEditorMacroscopica}
                      readOnly={disabled}
                      toolbar={toolBarOptions}
                    />
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Text key="expediente">DESCRIPCIÓN MICROSCÓPICA</Text>
                  <Editor
                    editorState={editorMicroscopica}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    onEditorStateChange={setEditorMicroscopica}
                    readOnly={disabled}
                    toolbar={toolBarOptions}
                  />
                </Col>
              </Row>
              {estudio.areaId === 30 && (
                <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <Col span={24}>
                    <Upload
                      multiple
                      listType="picture"
                      beforeUpload={beforeUploadTest}
                      onRemove={removeTestFile}
                      className="upload-list-inline"
                      // defaultFileList={prueba}
                      fileList={prueba}
                    >
                      <Button type="primary" disabled={disabled}>
                        Añadir imagen(es) +
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              )}

              <Row>
                <Col span={24}>
                  <Text key="expediente">DIAGNÓSTICO</Text>
                  <Editor
                    editorState={editorDiagnostico}
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    onEditorStateChange={setEditorDiagnostico}
                    readOnly={disabled}
                    toolbar={toolBarOptions}
                  />
                </Col>
              </Row>
              <Row justify="center">
                <Col span={2}>
                  <Text key="expediente">Atentamente.</Text>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={4}>
                  <SelectInput
                    formProps={{
                      name: "medicoId",
                      label: "Dr.",
                    }}
                    options={medicOptions}
                    readonly={disabled}
                  ></SelectInput>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default observer(ClinicalResultsForm);
