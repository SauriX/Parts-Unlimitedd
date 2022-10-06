import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Row,
  Table,
  Input,
  UploadFile,
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
} from "../../../app/models/request";
import { FC, useEffect, useState } from "react";
import { toJS } from "mobx";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { status } from "../../../app/util/catalogs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  ClinicResultsCaptureForm,
  IClinicResultCaptureForm,
  IResultPathological,
} from "../../../app/models/clinicResults";
import { IClinicList } from "../../../app/models/clinic";
import { objectToFormData } from "../../../app/util/utils";
import { IOptions } from "../../../app/models/shared";
import TextInput from "../../../app/common/form/proposal/TextInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
const { Text, Title } = Typography;

type ClinicalResultsDetailProps = {
  estudio: IRequestStudy;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: number;
};

const ClinicalResultsDetail: FC<ClinicalResultsDetailProps> = ({
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
  const [values, setValues] = useState<IClinicResultCaptureForm>(
    new ClinicResultsCaptureForm()
  );
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [prueba, setPrueba] = useState<UploadFile[]>([]);
  const [currentResult, setCurrentResult] =
    useState<IClinicResultCaptureForm>();
  const [loading, setLoading] = useState(false);
  const { optionStore, clinicResultsStore } = useStore();
  const { getRequestStudyById, updateStatusStudy } = clinicResultsStore;
  const {
    getStudies,
    studies,
    createResults,
    updateResults,
  } = clinicResultsStore;
  const { medicOptions, getMedicOptions } = optionStore;
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
    const loadOptions = async () => {
      await getMedicOptions();
    };
    loadOptions();
  }, []);

  useEffect(() => {
    form.setFieldValue("dr", claveMedico);
  }, [claveMedico]);

  const loadInit = async () => {};

  useEffect(() => {
    loadInit();
  }, []);

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
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: "25%",
    },
    {
      key: "Orden",
      dataIndex: "orden",
      title: "Orden",
      align: "left",
      width: "10%",
    },
    {
      key: "Estatus",
      dataIndex: "estatus",
      title: "Estatus",
      align: "left",
      width: "10%",
    },
    {
      key: "Seleccionar",
      dataIndex: "imprimir",
      title: "Seleccionar",
      align: "left",
      width: "10%",
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
  const guardarReporte = async (values: any) => {};

  const onFinish = async (newValuesForm: IClinicResultCaptureForm[]) => {
    setLoading(true);
    const labResults: IClinicResultCaptureForm[] = newValuesForm.map(
      (newValues) => ({
        id: newValues.id,
        estudioId: estudio.id!,
        nombre: newValues.nombre,
        solicitudId: solicitud.solicitudId!,
        parametroId: newValues.parametroId,
        tipoValorId: newValues.tipoValorId,
        valorInicial: newValues.valorInicial,
        valorFinal: newValues.valorFinal,
        resultado: newValues.resultado,
        unidades: newValues.unidades,
      })
    );

    if (!!currentResult) {
      await updateResults(labResults);
      await updateStatus();
    } else {
      await createResults(labResults);
      await updateStatus();
    }

    setLoading(false);
  };

  const updateStatus = async () => {
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      await updateStatusStudy(currentStudy.id, status.requestStudy.capturado);
    }
  };

  return (
    <>
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
      <Card className="capture-details">
        <Form
          form={form}
          initialValues={currentResult}
          onFinish={onFinish}
          name="dynamic_form_item"
          onValuesChange={(changes_values: any) => {
            setDisabled(
              !form.isFieldsTouched() ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
            );
          }}
        >
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[0, 12]}>
                {studies.map((x) => {
                  return x.parametros.map((param) => {
                    return (
                      <>
                        <Col span={6}>
                          <h4>{param.nombre}</h4>
                        </Col>
                        <Col span={6}>
                          {param.tipoValorId < 4 ? (
                            <NumberInput
                              formProps={{
                                name: "resultado",
                                label: "",
                              }}
                              min={0}
                            />
                          ) : (
                            <TextInput
                              formProps={{
                                name: "resultado",
                                label: "",
                              }}
                            />
                          )}
                        </Col>
                        <Col span={6}>{param.unidades}</Col>
                        <Col span={6}>
                          {param.valorInicial - param.valorFinal}
                        </Col>
                      </>
                    );
                  });
                })}
              </Row>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};
export default observer(ClinicalResultsDetail);
