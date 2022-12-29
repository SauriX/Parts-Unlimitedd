import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import { observer } from "mobx-react-lite";
import { Typography } from "antd";
import { IColumns } from "../../../app/common/table/utils";
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
import moment from "moment";
import { ObservationModal } from "./ObservationModal";
import { DownloadOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Text } = Typography;

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
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );

  const [loading, setLoading] = useState(false);
  const [envioManual, setEnvioManual] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const [hideWhenCancel, setHideWhenCancel] = useState(false);
  const [exportGlucoseData, setExportGlucoseData] =
    useState<IClinicResultCaptureForm>();
  const [resultParam, setResultParam] = useState<any[]>([]);
  const { optionStore, clinicResultsStore } = useStore();

  const {
    getRequestStudyById,
    updateStatusStudy,
    studies,
    exportGlucose,
    updateResults,
    cancelResults,
    addSelectedStudy,
    removeSelectedStudy,
    observationsSelected,
    setObservationsSelected,
  } = clinicResultsStore;

  const { getMedicOptions, getUnitOptions } = optionStore;
  const [form] = Form.useForm();
  const resultValue = Form.useWatch(
    "parametros",
    form
  ) as IClinicResultCaptureForm[];

  useEffect(() => {
    setCheckedPrint(isMarked);
    if (currentStudy.estatusId > status.requestStudy.capturado) {
      if (isMarked) {
        addSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
      } else {
        removeSelectedStudy({
          id: currentStudy.id!,
          tipo: "LABORATORY",
        });
      }
    }
  }, [isMarked]);

  useEffect(() => {
    const loadOptions = async () => {
      await getMedicOptions();
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

  useEffect(() => {}, [resultValue]);

  const loadInit = async () => {
    const cStudy = await getRequestStudyById(estudio.id!);
    setCurrentStudy(cStudy!);

    let captureResult = studies.find((x) => x.id == estudioId);

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

  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave",
      align: "left",
      width: "15%",
      render: () => {
        return <strong>{estudio.clave}</strong>;
      },
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Estudio",
      align: "left",
      width: "20%",
      render: () => {
        return <strong>{estudio.nombre}</strong>;
      },
    },
    {
      key: "Orden",
      dataIndex: "orden",
      title: "Acciones",
      align: "left",
      width: "20%",
      render: () => renderUpdateStatus(),
    },
    {
      key: "Seleccionar",
      dataIndex: "imprimir",
      title: "Seleccionar",
      align: "center",
      width: "5%",
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
                  tipo: "LABORATORY",
                });
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
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[12, 24]}>
                {currentStudy.estatusId <= 3 ? (
                  ""
                ) : (
                  <>
                    <Col
                      span={
                        currentStudy.estudioId == 631
                          ? 8
                          : currentStudy.estatusId ==
                            status.requestStudy.liberado
                          ? 6
                          : 12
                      }
                    >
                      <Button
                        type="default"
                        htmlType="submit"
                        disabled={
                          currentStudy.estatusId ===
                            status.requestStudy.tomaDeMuestra ||
                          currentStudy.estatusId ===
                            status.requestStudy.pendiente
                        }
                        onClick={async () => {
                          setLoading(true);
                          await updateStatus(true);
                          setLoading(false);
                        }}
                        danger
                      >
                        Cancelar{" "}
                        {currentStudy.estatusId ===
                        status.requestStudy.capturado
                          ? "Captura"
                          : currentStudy.estatusId ===
                            status.requestStudy.validado
                          ? "Validación"
                          : ""}
                      </Button>
                    </Col>
                  </>
                )}
                <Col
                  span={
                    currentStudy.estudioId == 631
                      ? 8
                      : currentStudy.estatusId == status.requestStudy.liberado
                      ? 6
                      : 12
                  }
                >
                  <Button
                    type="primary"
                    htmlType="submit"
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
                      ? "Validar estudio"
                      : currentStudy.estatusId === status.requestStudy.validado
                      ? "Liberar estudio"
                      : currentStudy.estatusId ===
                        status.requestStudy.solicitado
                      ? "Guardar captura"
                      : ""}
                  </Button>
                </Col>
                {currentStudy.estatusId === status.requestStudy.liberado ? (
                  <Col
                    span={
                      currentStudy.estudioId == 631
                        ? 8
                        : currentStudy.estatusId == status.requestStudy.liberado
                        ? 6
                        : 12
                    }
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        setEnvioManual(true);
                        form.submit();
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
                {currentStudy.estudioId == 631 &&
                currentStudy.estatusId >= 5 ? (
                  <Col
                    span={
                      currentStudy.estudioId == 631
                        ? 8
                        : currentStudy.estatusId == status.requestStudy.liberado
                        ? 6
                        : 12
                    }
                  >
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={async () => {
                        setLoading(true);
                        await exportGlucose(exportGlucoseData!);
                        setLoading(false);
                      }}
                    >
                      Exportar a Excel
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

  const onFinish = async (newValuesForm: any) => {
    setLoading(true);
    let labResults: IClinicResultCaptureForm[] = newValuesForm.parametros;
    let success = false;
    await updateStatus();

    labResults = labResults.map((x) => {
      const obj = {
        ...x,
        resultado: Array.isArray(x.resultado)
          ? x.resultado.join()
          : x.resultado,
      };
      return obj;
    });

    console.log(labResults);
    success = await updateResults(
      labResults,
      solicitud.expedienteId,
      envioManual
    );
    if (success) {
      setHideWhenCancel(false);
      setObservationsSelected([]);
      await loadInit();
    }

    setLoading(false);
  };

  const cancelation = async (estado: number) => {
    await updateStatusStudy(currentStudy.id!, estado);
    if (estado === status.requestStudy.solicitado) {
      cancelResults(currentStudy.id!);
    }
    await loadInit();
  };

  const updateStatus = async (esCancelacion: boolean = false) => {
    let nuevoEstado = 0;
    if (currentStudy.estatusId === status.requestStudy.solicitado) {
      await updateStatusStudy(currentStudy.id!, status.requestStudy.capturado);
      return status.requestStudy.capturado;
    }
    if (currentStudy.estatusId === status.requestStudy.capturado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.solicitado
        : status.requestStudy.validado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
    }
    if (currentStudy.estatusId === status.requestStudy.validado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.capturado
        : status.requestStudy.liberado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
    }
    if (currentStudy.estatusId === status.requestStudy.liberado) {
      nuevoEstado = esCancelacion
        ? status.requestStudy.validado
        : status.requestStudy.enviado;
      await updateStatusStudy(currentStudy.id!, nuevoEstado);
    }
    if (esCancelacion) {
      await cancelation(nuevoEstado);
      removeSelectedStudy({
        id: currentStudy.id!,
        tipo: "LABORATORY",
      });
      setHideWhenCancel(true);
      setCheckedPrint(false);
    }
    return nuevoEstado;
  };

  const disableInput = () => {
    return currentStudy.estatusId > 3;
  };

  const referenceValues = (
    tipoValor: string,
    valorInicial?: string,
    valorFinal?: string,
    primeraColumna?: string,
    segundaColumna?: string,
    terceraColumna?: string,
    cuartaColumna?: string,
    quintaColumna?: string
  ) => {
    if (
      tipoValor == "1" ||
      tipoValor == "2" ||
      tipoValor == "3" ||
      tipoValor == "4"
    ) {
      return valorInicial + " - " + valorFinal;
    } else if (tipoValor == "7" || tipoValor == "8" || tipoValor == "10") {
      return valorInicial + "";
    } else if (tipoValor == "11") {
      return primeraColumna + " - " + segundaColumna + "\n";
    } else if (tipoValor == "12") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna}`;
    } else if (tipoValor == "13") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna} \t ${cuartaColumna}`;
    } else if (tipoValor == "14") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna} \t ${cuartaColumna} \t ${quintaColumna}`;
    }
  };

  return (
    <Fragment>
      {currentStudy.estatusId >= 3 && currentStudy.estatusId != 9 ? (
        <Spin spinning={loading}>
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
          <Card className="capture-details">
            <Form<IClinicResultCaptureForm>
              form={form}
              onFinish={onFinish}
              name="dynamic_form_item"
              onValuesChange={() => {
                setDisabled(
                  !form.isFieldsTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                );
              }}
              disabled={disableInput()}
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
                      <h3>PREVIO</h3>
                    </Col>
                    <Col span={4}>
                      <h3>UNIDADES</h3>
                    </Col>
                    <Col span={4}>
                      <h3>REFERENCIA</h3>
                    </Col>
                  </Row>
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
                                          fieldKey={[field.key, "resultado"]}
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
                                        <Button
                                          type="primary"
                                          onClick={async () => {
                                            const modal =
                                              await ObservationModal(
                                                fieldValue.parametroId,
                                                fieldValue.tipoValorId,
                                                observationsSelected
                                              );
                                            if (modal) {
                                              form.setFieldValue(
                                                [
                                                  "parametros",
                                                  field.name,
                                                  "resultado",
                                                ],
                                                modal
                                              );
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
                                        fieldKey={[field.key, "resultado"]}
                                        validateTrigger={["onChange", "onBlur"]}
                                        noStyle
                                      >
                                        {fieldValue.tipoValorId == "5" ||
                                        (fieldValue.tipoValorId == "6" &&
                                          fieldValue.clave !== "_OB_CTG") ? (
                                          <Select
                                            options={fieldValue.tipoValores!.map(
                                              (x) => ({
                                                key: x.id,
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
                                      {fieldValue.ultimoResultado == null
                                        ? "-"
                                        : fieldValue.ultimoResultado}
                                    </Col>
                                  ) : (
                                    <Fragment>
                                      <Col
                                        span={
                                          fieldValue.tipoValorId === "12"
                                            ? 3
                                            : 4
                                        }
                                      >
                                        {fieldValue.tipoValores!.map((x) => (
                                          <Fragment>
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
                                            <Fragment>
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
                                    <Fragment>
                                      <Col
                                        span={
                                          fieldValue.tipoValorId === "12"
                                            ? 3
                                            : 4
                                        }
                                      >
                                        {fieldValue.tipoValores!.map((x) => (
                                          <Fragment>
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
                                          <Fragment>
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
                                            <Fragment>
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
                                        {fieldValue.unidadNombre == null
                                          ? "-"
                                          : fieldValue.unidadNombre}
                                      </Col>
                                      <Col span={4}>
                                        {fieldValue.valorInicial == null
                                          ? "-"
                                          : referenceValues(
                                              fieldValue.tipoValorId,
                                              fieldValue.valorInicial,
                                              fieldValue.valorFinal
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
