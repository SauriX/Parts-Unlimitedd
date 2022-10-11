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
import { IResultPathological } from "../../../app/models/clinicResults";
import { objectToFormData } from "../../../app/util/utils";
import { RcFile } from "antd/lib/upload";
import { uniqueId, values } from "lodash";
const { Text, Title } = Typography;
type ClinicalResultsFormProps = {
  estudio: IRequestStudy;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: number;
  isMarked: boolean;
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
}) => {
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [prueba, setPrueba] = useState<UploadFile[]>([]);
  const [editorMacroscopica, setEditorMacroscopica] = useState<any>(
    EditorState.createEmpty()
  );
  const [editorMicroscopica, setEditorMicroscopica] = useState<any>(
    EditorState.createEmpty()
  );
  const [editorDiagnostico, setEditorDiagnostico] = useState<any>(
    EditorState.createEmpty()
  );
  const [currentResult, setCurrentResult] = useState<IResultPathological>();
  const [checkedPrint, setCheckedPrint] = useState(false);
  const { optionStore, clinicResultsStore } = useStore();
  const {
    createResultPathological,
    updateResultPathological,
    getResultPathological,
    getRequestStudyById,
    updateStatusStudy,
    addSelectedStudy,
    removeSelectedStudy,
  } = clinicResultsStore;
  const { medicOptions, getMedicOptions } = optionStore;
  const [form] = Form.useForm();
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
    if (currentStudy.estatusId > status.requestStudy.capturado) {
      if (isMarked) {
        addSelectedStudy({ id: currentStudy.id!,  tipo: "PATHOLOGICAL"});
      } else {
        removeSelectedStudy({ id: currentStudy.id!,  tipo: "PATHOLOGICAL"});
      }
    }
  }, [isMarked]);
  const loadInit = async () => {
    const resultPathological = await getResultPathological(estudio.id!);
    let archivos: RcFile[] = [];
    const cStudy = await getRequestStudyById(estudio.id!);
    console.log("estudio encontrado", toJS(cStudy));
    setCurrentStudy(cStudy!);
    if (resultPathological !== null) {
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

  const changeStatus = () => {
    if (estudio.estatusId === status.requestStudy.solicitado) {
    }
  };

  const { width: windowWidth } = useWindowDimensions();
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave",
      align: "left",
      width: 100,
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: 200,
    },
    {
      key: "estatus",
      dataIndex: "estatus",
      title: "Estatus",
      align: "left",
      width: 50,
      render: (value: any) => {
        return value.nombre;
      },
    },
    {
      key: "estatusId",
      dataIndex: "estatusId",
      title: "Fecha Atualización",
      align: "left",
      width: 50,
      render: (value: any, fullRow: any) => {
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
      width: 50,
    },
    {
      key: "Seleccionar",
      dataIndex: "imprimir",
      title: "Seleccionar",
      align: "center",
      width: 50,
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
                addSelectedStudy({ id: currentStudy.id!,  tipo: "PATHOLOGICAL"});
                setCheckedPrint(true);
              } else {
                removeSelectedStudy({ id: currentStudy.id!,  tipo: "PATHOLOGICAL"});
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
        {currentStudy.estatusId >= status.requestStudy.solicitado && (
          <>
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
                  await updateStatus(true);
                  await loadInit();
                }}
                danger
              >
                Cancelar{" "}
                {currentStudy.estatusId === status.requestStudy.capturado
                  ? "Captura"
                  : currentStudy.estatusId === status.requestStudy.validado
                  ? "Validación"
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
      estatus: updateStatus() ?? 0,
      departamentoEstudio:
        estudio.areaId === 30 ? "HISTOPATOLÓGICO" : "CITOLÓGICO",
    };
    const formData = objectToFormData(reporteClinico);

    console.log("resultado actual", toJS(currentResult));
    if (!!currentResult) {
      // if (estudio.estatusId === status.requestStudy.solicitado) {
      //   await updateResultPathological(formData);
      // }
      await updateResultPathological(formData);
      // await updateStatus();
      await loadInit();
    } else {
      if (estudio.estatusId === status.requestStudy.solicitado) {
        await createResultPathological(formData);
      }
      // await updateStatus();
      await loadInit();
    }
    console.log("reporte", reporteClinico);
    console.log("final form", values);
  };
  const updateStatus = (esCancelacion: boolean = false) => {
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      // await updateStatusStudy(currentStudy.id!, status.requestStudy.capturado);
      return status.requestStudy.capturado;
    }
    if (currentStudy.estatusId === status.requestStudy.capturado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.solicitado
        : status.requestStudy.validado;
      // await updateStatusStudy(currentStudy.id!, nuevoEstado);
      return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.validado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.capturado
        : status.requestStudy.liberado;
      // await updateStatusStudy(currentStudy.id!, nuevoEstado);
      return nuevoEstado;
    }
    if (currentStudy.estatusId === status.requestStudy.liberado) {
      const nuevoEstado = esCancelacion
        ? status.requestStudy.validado
        : status.requestStudy.enviado;
      // await updateStatusStudy(currentStudy.id!, nuevoEstado);
      return nuevoEstado;
    }
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
    // setPrueba((x) => [...x, value]);
    return false;
  };

  return (
    <>
      <Row style={{ marginBottom: "20px" }}>{renderUpdateStatus()}</Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            // dataSource={[estudio]}
            dataSource={[currentStudy]}
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
                    Estudio: <Text strong>{currentStudy.nombre}</Text>
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text key="expediente">
                    Clave: <Text strong>{estudio.clave}</Text>
                  </Text>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={6}>
                  <Title level={5}>
                    REPORTE DE ESTUDIO
                    {estudio.areaId === 30 ? "HISTOPATOLÓGICO" : "CITOLÓGICO"}
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