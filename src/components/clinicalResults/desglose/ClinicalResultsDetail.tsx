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
type ClinicalResultsDetailProps = {
  estudio: IRequestStudyInfo;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: string;
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
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [prueba, setPrueba] = useState<UploadFile[]>([]);
  const [currentResult, setCurrentResult] = useState<IResultPathological>();
  const { optionStore, clinicResultsStore } = useStore();
  const {
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
  };

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
                  
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default observer(ClinicalResultsDetail);
