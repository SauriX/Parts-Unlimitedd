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
  IRequestStudyInfo,
  RequestStudyInfoForm,
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
import { uniqueId } from "lodash";
const { Text, Title } = Typography;
type ClinicalResultsFormProps = {
  estudio: IRequestStudyInfo;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: string;
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
}) => {
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudyInfo>(
    new RequestStudyInfoForm()
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
  const { optionStore, clinicResultsStore } = useStore();
  const {
    createResultPathological,
    updateResultPathological,
    getResultPathological,
    getRequestStudyById,
    updateStatusStudy,
  } = clinicResultsStore;
  const { medicOptions, getMedicOptions } = optionStore;
  const [form] = Form.useForm();
  useEffect(() => {
    const loadOptions = async () => {
      await getMedicOptions();
    };
    loadOptions();
    console.log("estudio", toJS(estudio));
    console.log("paciente", toJS(paciente));
  }, []);
  useEffect(() => {
    form.setFieldValue("dr", claveMedico);
  }, [claveMedico]);

  const loadInit = async () => {
    const resultPathological = await getResultPathological(estudio.id);
    let archivos: RcFile[] = [];
    const cStudy = await getRequestStudyById(estudio.id);
    if (resultPathological?.imagenPatologica !== null) {
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
    setCurrentStudy(cStudy!);
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
    console.log("PRUEBA TEST", prueba);
  }, [prueba]);

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
      key: "Orden",
      dataIndex: "orden",
      title: "Orden",
      align: "left",
      width: 50,
    },
    {
      key: "Estatus",
      dataIndex: "estatus",
      title: "Estatus",
      align: "left",
      width: 50,
    },
    {
      key: "Seleccionar",
      dataIndex: "imprimir",
      title: "Seleccionar",
      align: "left",
      width: 50,
      render: () => {
        return <Checkbox></Checkbox>;
      },
    },
  ];

  const renderUpdateStatus = () => {
    return (
      <>
        {estudio.estatusId === status.requestStudy.solicitado && (
          <>
            <Col span={4}>
              <Button
                type="default"
                htmlType="submit"
                disabled={
                  estudio.estatusId === status.requestStudy.tomaDeMuestra ||
                  estudio.estatusId === status.requestStudy.pendiente
                }
                onClick={() => {}}
                danger
              >
                Cancelar{" "}
                {estudio.estatusId === status.requestStudy.capturado
                  ? "Captura"
                  : estudio.estatusId === status.requestStudy.validado
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
                {estudio.estatusId === status.requestStudy.capturado
                  ? "Validar"
                  : estudio.estatusId === status.requestStudy.validado
                  ? "Liberar"
                  : estudio.estatusId === status.requestStudy.solicitado
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
      requestStudyId: estudio.id,
      solicitudId: solicitud.solicitudId!,
      estudioId: estudio.id!,
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
    };
    const formData = objectToFormData(reporteClinico);

    console.log("resultado actual", toJS(currentResult));
    if (!!currentResult) {
      await updateResultPathological(formData);
      await updateStatus();
      await loadInit();
    } else {
      await createResultPathological(formData);
      await updateStatus();
      await loadInit();
    }
    console.log("reporte", reporteClinico);
    console.log("final form", values);
  };
  const updateStatus = async () => {
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      updateStatusStudy(currentStudy.id, status.requestStudy.capturado);
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
      <Row
        style={{
          marginBottom: "20px",
          padding: "5px",
          border: "3px solid #a39f9f",
          borderRadius: "10px",
          width: "100%",
        }}
        justify="space-between"
        gutter={[2, 12]}
      >
        <Col span={4}>
          <Title level={5}>Estatus</Title>
          <div>
            <Text>Toma de muestra</Text>
          </div>
          <div>
            <Text>Solicitado</Text>
          </div>
          <div>
            <Text>Capturado</Text>
          </div>
        </Col>

        <Col span={4}>
          <Title level={5}>Fecha de actualización</Title>
          <div>
            <Text>{estudio.fechaTomaMuestra}</Text>
          </div>
          <div>
            <Text>{estudio.fechaSolicitado}</Text>
          </div>
          <div>
            <Text>{estudio.fechaCaptura}</Text>
          </div>
        </Col>
        <Col span={4}>
          <Title level={5}>Estatus</Title>
          <div>
            <Text>Validado</Text>
          </div>
          <div>
            <Text>Liberado</Text>
          </div>
          <div>
            <Text>Enviado</Text>
          </div>
        </Col>
        <Col span={4}>
          <Title level={5}>Fecha de actualización</Title>
          <div>
            <Text>{estudio.fechaValidacion}</Text>
          </div>
          <div>
            <Text>{estudio.fechaLiberado}</Text>
          </div>
          <div>
            <Text>{estudio.fechaEnviado}</Text>
          </div>
        </Col>
        {renderUpdateStatus()}
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={[estudio]}
          />
        </Col>
      </Row>
      <Row>
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
                    Medico: <Text strong>{medico}</Text>
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
                    Estudio: <Text strong>{estudio.nombre}</Text>
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
                  <Title level={5}>REPORTE DE ESTUDIO CITOLÓGICO</Title>
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
                    <Button type="primary">Añadir imagen(es) +</Button>
                  </Upload>
                </Col>
              </Row>
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
                  {/* <TextAreaInput
                    formProps={{
                      name: "observaciones",
                    }}
                    rows={5}
                  /> */}
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
