import "../css/containerInfo.less";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tooltip,
} from "antd";
import { observer } from "mobx-react-lite";
import { Typography } from "antd";
import {
  IRequest,
  IRequestStudy,
  RequestStudyValues,
} from "../../../app/models/request";
import { FC, Fragment, useEffect, useState } from "react";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { status } from "../../../app/util/catalogs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IClinicResultCaptureForm } from "../../../app/models/clinicResults";
import { ObservationModal } from "./ObservationModal";
import { v4 as uuid } from "uuid";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import StatusTable from "../content/StatusTable";
import StudyActions from "../content/StudyActions";
import { referenceValues, updateStatus } from "../utils";

const { TextArea } = Input;
const { Text, Link } = Typography;

type ClinicalResultsDetailProps = {
  estudio: IRequestStudy;
  paciente: IProceedingForm;
  medico: string;
  claveMedico: string;
  solicitud: IRequest;
  estudioId: number;
  isMarked: boolean;
  printing: boolean;
  showHeaderTable: boolean;
};

const ClinicalResultsDetail: FC<ClinicalResultsDetailProps> = ({
  estudio,
  estudioId,
  claveMedico,
  paciente,
  isMarked,
  solicitud,
  showHeaderTable,
}) => {
  const { clinicResultsStore } = useStore();

  const {
    getRequestStudyById,
    updateStatusStudy,
    studies,
    updateResults,
    cancelResults,
    addSelectedStudy,
    removeSelectedStudy,
    observationsSelected,
    setObservationsSelected,
    clearSelectedStudies,
  } = clinicResultsStore;

  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );
  const [exportGlucoseData, setExportGlucoseData] =
    useState<IClinicResultCaptureForm>();

  const [loading, setLoading] = useState(false);
  const [envioManual, setEnvioManual] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const [resultParam, setResultParam] = useState<any[]>([]);
  const [modalValues, setModalValues] = useState<any>();

  const [form] = Form.useForm();
  const resultValue = Form.useWatch(
    "parametros",
    form
  ) as IClinicResultCaptureForm[];
  const navigate = useNavigate();

  useEffect(() => {
    clearSelectedStudies();
  }, []);

  useEffect(() => {}, [resultValue]);

  const loadInit = async () => {
    const cStudy = await getRequestStudyById(estudio.id!);
    setCurrentStudy(cStudy!);

    let captureResult = studies.find(
      (x) => x.solicitudEstudioId! == estudio.id
    );

    if (captureResult && captureResult.parametros) {
      captureResult.parametros = captureResult.parametros.map((x) => {
        const obj = {
          ...x,
          resultado:
            x.tipoValorId === "5" || x.tipoValorId === "6"
              ? x.resultado?.toString()?.split(",")
              : x.resultado,
          rango:
            x.criticoMinimo == 0 && x.criticoMaximo == 0
              ? false
              : x.criticoMinimo! >= parseFloat(x.resultado as string) ||
                parseFloat(x.resultado as string) >= x.criticoMaximo!,
        };
        return obj;
      });
    }

    setResultParam(captureResult === undefined ? [] : captureResult.parametros);
    setExportGlucoseData(
      captureResult?.parametros.find((x) => x.estudioId == 631)
    );
    form.setFieldValue("parametros", captureResult?.parametros);
  };

  useEffect(() => {
    loadInit();
  }, [studies, estudio, estudioId]);

  const onFinish = async (newValuesForm: any) => {
    setLoading(true);
    let labResults: IClinicResultCaptureForm[] = newValuesForm.parametros;
    let success = false;

    labResults = labResults.map((x) => {
      const obj = {
        ...x,
        resultado: Array.isArray(x.resultado)
          ? x.resultado.join()
          : x.resultado,
      };
      return obj;
    });

    success = await updateResults(
      labResults,
      solicitud.expedienteId,
      envioManual
    );
    if (success) {
      setObservationsSelected([]);
      await loadInit();
    }

    setLoading(false);
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
      {currentStudy.estatusId >= 3 && currentStudy.estatusId != 9 ? (
        <Spin spinning={loading}>
          <Row gutter={[24, 24]} className="study-divider" >
            <Col span={24}>
              <StudyActions
                currentStudy={currentStudy}
                setEnvioManual={setEnvioManual}
                setCheckedPrint={setCheckedPrint}
                checkedPrint={checkedPrint}
                exportGlucoseData={exportGlucoseData}
                isMarked={isMarked}
                submitResults={onSubmit} 
                tipoEstudio={"LABORATORY"}     
                isXRay={false}           
              />
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <StatusTable currentStudy={currentStudy} />
            </Col>
          </Row>
          <Card className="capture-details">
            <Form<IClinicResultCaptureForm>
              form={form}
              onFinish={onFinish}
              name="dynamic_form_item"
              disabled={currentStudy.estatusId > status.requestStudy.solicitado}
            >
              <Row>
                <Col span={24}>
                  <Row
                    justify="space-between"
                    gutter={[0, 12]}
                    style={{ textAlign: "center" }}
                  >
                    <Col span={4}>
                      <h3>EXAMEN</h3>
                    </Col>
                    <Col span={4}>
                      <h3>RESULTADO</h3>
                    </Col>
                    <Col span={4}>
                      <h3>UNIDADES</h3>
                    </Col>
                    <Col span={4}>
                      <h3>REFERENCIA</h3>
                    </Col>
                    <Col span={4}>
                      <h3>PREVIO</h3>
                    </Col>
                  </Row>
                  <Form.List name="parametros">
                    {(fields) => (
                      <>
                        {fields.map((field, index) => {
                          let fieldValue = form.getFieldValue([
                            "parametros",
                            field.name,
                          ]) as IClinicResultCaptureForm;
                          let fieldResult = resultValue?.find(
                            (x) => x.id === fieldValue.id
                          )?.resultado as string;

                          let fieldRange =
                            parseFloat(fieldValue.valorInicial) >
                              parseFloat(fieldResult ?? 0) ||
                            parseFloat(fieldResult ?? 0) >
                              parseFloat(fieldValue.valorFinal);

                          let valuesByColumn =
                            fieldValue.tipoValorId == "11" ||
                            fieldValue.tipoValorId == "12" ||
                            fieldValue.tipoValorId == "13" ||
                            fieldValue.tipoValorId == "14";

                          return (
                            <Row
                              key={field.key}
                              justify="space-between"
                              gutter={[0, 24]}
                              style={{
                                textAlign: "center",
                                marginBottom: 5,
                              }}
                              align="middle"
                            >
                              {fieldValue.tipoValorId == "9" ||
                              (fieldValue.clave === "_OB_CTG" &&
                                paciente.sexo === "M") ? (
                                fieldValue.nombre != null ? (
                                  <Col span={4}>
                                    <strong>{fieldValue.nombre}</strong>
                                  </Col>
                                ) : (
                                  <Col span={24}>
                                    <br />
                                  </Col>
                                )
                              ) : (
                                <>
                                  <Col span={4}>
                                    <h4>{fieldValue.nombre}</h4>
                                    {"\n"}
                                    <h5
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      {fieldValue.rango
                                        ? fieldValue.resultado
                                        : null}
                                    </h5>
                                  </Col>
                                  <Col span={4}>
                                    {fieldValue.tipoValorId == "10" ||
                                    fieldValue.tipoValorId == "7" ? (
                                      <>
                                        <Form.Item
                                          {...field}
                                          name={[field.name, "resultado"]}
                                          validateTrigger={[
                                            "onChange",
                                            "onBlur",
                                          ]}
                                          noStyle
                                        >
                                          <TextArea
                                            placeholder="Resultado"
                                            style={{
                                              width: "72%",
                                              marginBottom: "7px",
                                            }}
                                            rows={4}
                                            allowClear
                                            autoSize
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          {...field}
                                          name={[field.name, "observacionesId"]}
                                          noStyle
                                          key={uuid()}
                                        >
                                          <Input style={{ display: "none" }} />
                                        </Form.Item>
                                        <Button
                                          type="primary"
                                          onClick={async () => {
                                            const modal: any =
                                              await ObservationModal(
                                                fieldValue.parametroId,
                                                fieldValue.tipoValorId,
                                                observationsSelected,
                                                form.getFieldValue([
                                                  "parametros",
                                                  field.name,
                                                  "observacionesId",
                                                ])
                                              );
                                            if (modal) {
                                              form.setFieldValue(
                                                [
                                                  "parametros",
                                                  field.name,
                                                  "resultado",
                                                ],
                                                modal.data
                                              );
                                              form.setFieldValue(
                                                [
                                                  "parametros",
                                                  field.name,
                                                  "observacionesId",
                                                ],
                                                modal.value
                                              );
                                              setModalValues(modal);
                                            }
                                          }}
                                        >
                                          ...
                                        </Button>
                                      </>
                                    ) : (
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "resultado"]}
                                        validateTrigger={["onChange", "onBlur"]}
                                        noStyle
                                        key={"resultado"}
                                      >
                                        {fieldValue.tipoValorId == "5" ||
                                        (fieldValue.tipoValorId == "6" &&
                                          fieldValue.clave !== "_OB_CTG") ? (
                                          <Select
                                            options={fieldValue.tipoValores!.map(
                                              (x) => ({
                                                key: uuid(),
                                                value:
                                                  fieldValue.tipoValorId == "5"
                                                    ? x.opcion!
                                                    : fieldValue.tipoValorId ==
                                                        "6" &&
                                                      currentStudy.id !== 631
                                                    ? x.primeraColumna
                                                    : x.opcion!,
                                                label:
                                                  fieldValue.tipoValorId == "5"
                                                    ? x.opcion!
                                                    : fieldValue.tipoValorId ==
                                                        "6" &&
                                                      currentStudy.id !== 631
                                                    ? x.primeraColumna
                                                    : x.opcion!,
                                              })
                                            )}
                                            allowClear
                                            style={{
                                              width: "80%",
                                              marginBottom: "7px",
                                            }}
                                          />
                                        ) : (
                                          <Input
                                            placeholder="Resultado"
                                            className={"center-input"}
                                            style={
                                              fieldRange && fieldResult
                                                ? {
                                                    width: "80%",
                                                    borderColor: "red",
                                                    marginBottom: "7px",
                                                  }
                                                : {
                                                    width: "80%",
                                                    marginBottom: "7px",
                                                  }
                                            }
                                            allowClear
                                            disabled={
                                              !fieldValue.editable ||
                                              currentStudy.estatusId > 3
                                            }
                                          />
                                        )}
                                      </Form.Item>
                                    )}
                                  </Col>
                                  {parseInt(fieldValue.tipoValorId) < 12 ? (
                                    <Col span={4}>
                                      {fieldValue.unidadNombre == null
                                        ? "-"
                                        : fieldValue.unidadNombre}
                                    </Col>
                                  ) : (
                                    <Fragment key={uuid()}>
                                      <Col
                                        span={
                                          fieldValue.tipoValorId === "12"
                                            ? 3
                                            : 4
                                        }
                                      >
                                        {fieldValue.tipoValores!.map((x) => (
                                          <Fragment key={uuid()}>
                                            <Text>{x.primeraColumna}</Text>
                                            <br />
                                          </Fragment>
                                        ))}
                                      </Col>
                                      {parseInt(fieldValue.tipoValorId) >=
                                      13 ? (
                                        <Col
                                          span={
                                            fieldValue.tipoValorId === "12"
                                              ? 3
                                              : 4
                                          }
                                        >
                                          {fieldValue.tipoValores!.map((x) => (
                                            <Fragment key={uuid()}>
                                              <Text>{x.segundaColumna}</Text>
                                              <br />
                                            </Fragment>
                                          ))}
                                        </Col>
                                      ) : (
                                        ""
                                      )}
                                    </Fragment>
                                  )}
                                  {parseInt(fieldValue.tipoValorId) >= 11 ? (
                                    <Fragment key={uuid()}>
                                      <Col
                                        span={
                                          fieldValue.tipoValorId === "12"
                                            ? 3
                                            : 4
                                        }
                                      >
                                        {fieldValue.tipoValores!.map((x) => (
                                          <Fragment key={uuid()}>
                                            <Text>
                                              {fieldValue.tipoValorId === "12"
                                                ? x.segundaColumna
                                                : fieldValue.tipoValorId ===
                                                  "13"
                                                ? x.terceraColumna
                                                : x.primeraColumna}
                                            </Text>
                                            <br />
                                          </Fragment>
                                        ))}
                                      </Col>
                                      <Col
                                        span={
                                          fieldValue.tipoValorId === "12"
                                            ? 3
                                            : fieldValue.tipoValorId === "14"
                                            ? 1.5
                                            : 4
                                        }
                                      >
                                        {fieldValue.tipoValores!.map((x) => (
                                          <Fragment key={uuid()}>
                                            <Text>
                                              {fieldValue.tipoValorId === "12"
                                                ? x.terceraColumna
                                                : fieldValue.tipoValorId ===
                                                  "13"
                                                ? x.cuartaColumna
                                                : x.segundaColumna}
                                            </Text>
                                            <br />
                                          </Fragment>
                                        ))}
                                      </Col>
                                      {fieldValue.tipoValorId === "14" ? (
                                        <Col span={1.5}>
                                          {fieldValue.tipoValores!.map((x) => (
                                            <Fragment key={uuid()}>
                                              <Text>{x.quintaColumna}</Text>
                                              <br />
                                            </Fragment>
                                          ))}
                                        </Col>
                                      ) : (
                                        ""
                                      )}
                                    </Fragment>
                                  ) : (
                                    ""
                                  )}
                                  {!valuesByColumn ? (
                                    <>
                                      <Col span={4}>
                                        {fieldValue.valorInicial == null
                                          ? "-"
                                          : referenceValues(
                                              fieldValue.tipoValorId,
                                              fieldValue.valorInicial,
                                              fieldValue.valorFinal
                                            )}
                                      </Col>
                                      <Col span={4}>
                                        {fieldValue.ultimoResultado == null &&
                                        fieldValue.ultimaSolicitud == null ? (
                                          "-"
                                        ) : (
                                          <Tooltip
                                            title={
                                              <>
                                                <Text>
                                                  {fieldValue.ultimoResultado} -{" "}
                                                  <Link
                                                    onClick={() => {
                                                      navigate(
                                                        `/clinicResultsDetails/${fieldValue.ultimoExpedienteId}/${fieldValue.ultimaSolicitudId}`
                                                      );
                                                    }}
                                                  >
                                                    {fieldValue.ultimaSolicitud}
                                                  </Link>
                                                </Text>
                                              </>
                                            }
                                            color="#ffffff"
                                          >
                                            <EyeOutlined
                                              style={{ cursor: "pointer" }}
                                            />
                                          </Tooltip>
                                        )}
                                      </Col>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </Row>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      ) : null}
    </Fragment>
  );
};
export default observer(ClinicalResultsDetail);
