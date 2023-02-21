import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Row,
  Spin,
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
import { FC, Fragment, useEffect, useState } from "react";
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
import StatusTable from "../content/StatusTable";
import { updateStatus } from "../utils";
import StudyActions from "../content/StudyActions";
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
    cancelResults,
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
    setDisabled(!(currentStudy.estatusId === status.requestStudy.solicitado));
  }, [estudio, currentStudy]);

  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave",
      align: "left",
      width: "15%",
      render: () => {
        return <strong>{estudio.areaId === 30 ? "HP" : "CITO"}</strong>;
      },
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: "20%",
      render: () => {
        return (
          <strong>
            {estudio.areaId === 30 ? "HISTOPATOLOGÍA" : "CITOLOGÍA"}
          </strong>
        );
      },
    },
  ];

  const guardarReporte = async (values: any) => {
    setLoading(true);
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
      estatus: currentStudy.estatusId,
      departamentoEstudio:
        estudio.areaId === 30 ? "HISTOPATOLÓGICO" : "CITOLÓGICO",
    };

    const formData = objectToFormData(reporteClinico);

    if (!!currentResult) {
      await updateResultPathological(formData, envioManual);
    } else {
      await createResultPathological(formData);
    }
    await loadInit();
    setLoading(false);
  };

  const removeTestFile = (file: any) => {
    const index = prueba.indexOf(file);
    const newFileList = prueba.slice();
    setDeletedFiles((x) => [...x, prueba[index].name!]);
    newFileList.splice(index, 1);
    setPrueba(newFileList);
  };
  const beforeUploadTest = (value: any) => {
    setPrueba((x) => [...x, value]);
    return false;
  };

  const cancelation = async (estado: number) => {
    await updateStatusStudy(currentStudy.id!, estado);
    if (estado === status.requestStudy.solicitado) {
      return cancelResults(currentStudy.id!);
    }
  };

  const onSubmit = async (
    esCancelacion: boolean,
    currentStudy: IRequestStudy
  ) => {
    const isUpdated = await updateStatus(
      esCancelacion,
      currentStudy,
      updateStatusStudy,
      cancelation,
      removeSelectedStudy,
      setCheckedPrint
    );
    if (isUpdated) {
      await loadInit();
    }
  };

  return (
    <Fragment key={estudio.id}>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]} className="study-divider">
          <Col span={24}>
            <StudyActions
              currentStudy={currentStudy}
              setEnvioManual={setEnvioManual}
              setCheckedPrint={setCheckedPrint}
              checkedPrint={checkedPrint}
              isMarked={isMarked}
              submitResults={onSubmit}
              tipoEstudio={"PATHOLOGICAL"}
              isXRay={false}
            />
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <StatusTable currentStudy={currentStudy} />
          </Col>
        </Row>
        <Row style={{ margin: "20px 0" }}>
          <Col span={24}>
            <Card className="capture-observartions">
              <Form
                form={form}
                initialValues={currentResult}
                onFinish={guardarReporte}
                onValuesChange={(changes_values: any) => {
                  setDisabled(
                    !form.isFieldsTouched() ||
                      form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length > 0
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
                      <Text strong>
                        {estudio.areaId === 30 ? "HP" : "CITO"}
                      </Text>
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
      </Spin>
    </Fragment>
  );
};
export default observer(ClinicalResultsForm);
