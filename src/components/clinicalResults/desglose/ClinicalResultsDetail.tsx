import "../css/containerInfo.less";
import {
  Button,
  Card,
  Col,
  Form,
  FormListFieldData,
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
import { parameters, status } from "../../../app/util/catalogs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IClinicResultCaptureForm } from "../../../app/models/clinicResults";
import { ObservationModal } from "./ObservationModal";
import { v4 as uuid } from "uuid";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import StatusTable from "../content/StatusTable";
import StudyActions from "../content/StudyActions";
import { referenceValues, updateStatus } from "../utils";
import { ItipoValorForm as ITipoValorForm } from "../../../app/models/parameter";
import Title from "antd/lib/typography/Title";
import TitleColumns from "../content/TitleColumns";

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
    console.log(estudioId);

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

    return success;
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
    setLoading(true);
    const isUpdated = await updateStatus(
      esCancelacion,
      currentStudy,
      updateStatusStudy,
      cancelation,
      removeSelectedStudy,
      setCheckedPrint
    );

    const saveResults = await onFinish(form.getFieldsValue());

    if (isUpdated && saveResults) {
      setObservationsSelected([]);
      await loadInit();
    }
    setLoading(false);
  };

  const selectInputOptions = (
    tipoValor: ITipoValorForm[] | undefined,
    fieldValue: IClinicResultCaptureForm
  ) => {
    if (tipoValor === undefined) return [];

    return fieldValue.tipoValores!.map((x) => ({
      key: uuid(),
      value:
        fieldValue.tipoValorId == parameters.valueType.opcionMultiple
          ? x.opcion!
          : fieldValue.tipoValorId == parameters.valueType.unaColumna &&
            currentStudy.id !== 631
          ? x.primeraColumna
          : x.opcion!,
      label:
        fieldValue.tipoValorId == parameters.valueType.opcionMultiple
          ? x.opcion!
          : fieldValue.tipoValorId == parameters.valueType.unaColumna &&
            currentStudy.id !== 631
          ? x.primeraColumna
          : x.opcion!,
    }));
  };

  const openTextTypeModal = async (
    fieldValue: IClinicResultCaptureForm,
    field: FormListFieldData
  ) => {
    const modal: any = await ObservationModal(
      fieldValue.parametroId,
      fieldValue.tipoValorId,
      observationsSelected,
      form.getFieldValue(["parametros", field.name, "observacionesId"])
    );
    if (modal) {
      form.setFieldValue(["parametros", field.name, "resultado"], modal.data);
      form.setFieldValue(
        ["parametros", field.name, "observacionesId"],
        modal.value
      );
      setModalValues(modal);
    }
  };

  console.log(currentStudy);

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
              exportGlucoseData={exportGlucoseData}
              isMarked={isMarked}
              submitResults={onSubmit}
              tipoEstudio={"LABORATORY"}
              isXRay={false}
            />
          </Col>
        </Row>
        {currentStudy.estatusId !== status.requestStudy.cancelado ? (
          <Fragment>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <StatusTable currentStudy={currentStudy} />
              </Col>
            </Row>
          </Fragment>
        ) : (
          ""
        )}
        <Card className="capture-details">
          <Form<IClinicResultCaptureForm>
            form={form}
            onFinish={onFinish}
            name="dynamic_form_item"
            disabled={
              currentStudy.estatusId > status.requestStudy.solicitado ||
              currentStudy.estatusId < status.requestStudy.solicitado
            }
          >
            <Row>
              <Col span={24}>
                <TitleColumns />
                <Form.List name="parametros">
                  {(fields) => (
                    <>
                      {fields.map((field) => {
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
                        let valuesByColumn = false;
                        switch (fieldValue.tipoValorId) {
                          case "11":
                          case "12":
                          case "13":
                          case "14":
                            valuesByColumn = true;
                            break;
                          default:
                            break;
                        }
                        return (
                          <Row
                            key={field.key}
                            justify="space-between"
                            style={{
                              textAlign: "center",
                            }}
                            align="middle"
                          >
                            {fieldValue.tipoValorId ==
                              parameters.valueType.etiqueta ||
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
                                {parseInt(fieldValue.tipoValorId) <
                                Number(parameters.valueType.dosColumnas) ? (
                                  <Col span={4}>
                                    {fieldValue.tipoValorId ==
                                      parameters.valueType.observacion ||
                                    fieldValue.tipoValorId ==
                                      parameters.valueType.parrafo ||
                                    fieldValue.tipoValorId ==
                                      parameters.valueType.texto ? (
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
                                            }}
                                            className="result-textarea"
                                            rows={4}
                                            bordered
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
                                          onClick={() => {
                                            openTextTypeModal(
                                              fieldValue,
                                              field
                                            );
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
                                        {fieldValue.tipoValorId ==
                                          parameters.valueType.opcionMultiple ||
                                        (fieldValue.tipoValorId ==
                                          parameters.valueType.unaColumna &&
                                          fieldValue.clave !== "_OB_CTG") ? (
                                          <Select
                                            options={selectInputOptions(
                                              fieldValue.tipoValores,
                                              fieldValue
                                            )}
                                            allowClear
                                            style={{
                                              width: "80%",
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
                                                  }
                                                : {
                                                    width: "80%",
                                                  }
                                            }
                                            allowClear
                                            disabled={
                                              !fieldValue.editable ||
                                              currentStudy.estatusId >
                                                status.requestStudy
                                                  .solicitado ||
                                              currentStudy.estatusId <
                                                status.requestStudy.solicitado
                                            }
                                          />
                                        )}
                                      </Form.Item>
                                    )}
                                  </Col>
                                ) : (
                                  <Col span={4}></Col>
                                )}
                                {parseInt(fieldValue.tipoValorId) <
                                Number(parameters.valueType.tresColumnas) ? (
                                  <Col span={4}>
                                    {fieldValue.unidadNombre == null
                                      ? "-"
                                      : fieldValue.unidadNombre}
                                  </Col>
                                ) : (
                                  <Fragment key={uuid()}>
                                    <Col span={4}>
                                      <Title level={5}> Columna No.1 </Title>
                                      {fieldValue.tipoValores!.map((x) => (
                                        <Fragment key={uuid()}>
                                          <Text>
                                            {!!x.primeraColumna
                                              ? x.primeraColumna
                                              : "-"}
                                          </Text>
                                          <br />
                                        </Fragment>
                                      ))}
                                    </Col>
                                    {parseInt(fieldValue.tipoValorId) >= 13 ? (
                                      <Col span={4}>
                                        <Title level={5}> Columna No.2 </Title>
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
                                    <Col span={4}>
                                      <Title level={5}>
                                        {" "}
                                        {fieldValue.tipoValorId ===
                                        parameters.valueType.tresColumnas
                                          ? "Columna No.2"
                                          : fieldValue.tipoValorId ===
                                            parameters.valueType.cuatroColumnas
                                          ? "Columna No.3"
                                          : "Columna No.1"}{" "}
                                      </Title>
                                      {fieldValue.tipoValores!.map((x) => (
                                        <Fragment key={uuid()}>
                                          <Text>
                                            {fieldValue.tipoValorId ===
                                            parameters.valueType.tresColumnas
                                              ? x.segundaColumna
                                              : fieldValue.tipoValorId ===
                                                parameters.valueType
                                                  .cuatroColumnas
                                              ? x.terceraColumna
                                              : x.primeraColumna}
                                          </Text>
                                          <br />
                                        </Fragment>
                                      ))}
                                    </Col>
                                    <Col span={4}>
                                      <Title level={5}>
                                        {" "}
                                        {fieldValue.tipoValorId ===
                                        parameters.valueType.tresColumnas
                                          ? "Columna No.3"
                                          : fieldValue.tipoValorId ===
                                            parameters.valueType.cuatroColumnas
                                          ? "Columna No.4"
                                          : "Columna No.2"}{" "}
                                      </Title>
                                      {fieldValue.tipoValores!.map((x) => (
                                        <Fragment key={uuid()}>
                                          <Text>
                                            {fieldValue.tipoValorId ===
                                            parameters.valueType.tresColumnas
                                              ? x.terceraColumna
                                              : fieldValue.tipoValorId ===
                                                parameters.valueType
                                                  .cuatroColumnas
                                              ? x.cuartaColumna
                                              : x.segundaColumna}
                                          </Text>
                                          <br />
                                        </Fragment>
                                      ))}
                                    </Col>
                                    {fieldValue.tipoValorId === "14" ? (
                                      <Col
                                        span={
                                          fieldValue.tipoValorId ===
                                          parameters.valueType.cuatroColumnas
                                            ? 3
                                            : 4
                                        }
                                      >
                                        <Title level={5}> Columna No.5 </Title>
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
    </Fragment>
  );
};
export default observer(ClinicalResultsDetail);
