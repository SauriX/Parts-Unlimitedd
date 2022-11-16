import "../css/containerInfo.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  Select,
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
const { Text, Title } = Typography;
const { TextArea } = Input;

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
  isMarked,
  showHeaderTable,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );

  const [loading, setLoading] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const [hideWhenCancel, setHideWhenCancel] = useState(false);
  const { optionStore, clinicResultsStore, parameterStore } = useStore();
  const [resultParam, setResultParam] = useState<any[]>([]);
  const {
    getRequestStudyById,
    updateStatusStudy,
    studies,
    data,
    updateResults,
    cancelResults,
    addSelectedStudy,
    removeSelectedStudy,
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
        removeSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
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
    console.log(cStudy);

    let captureResult = studies.find((x) => x.id == estudioId);

    if (captureResult && captureResult.parametros) {
      captureResult.parametros = captureResult.parametros.map((x) => {
        const obj = {
          ...x,
          resultado:
            x.tipoValorId === "5"
              ? x.resultado?.toString()?.split(",")
              : x.resultado,
          rango:
            x.criticoMinimo! >= parseFloat(x.resultado as string) ||
            parseFloat(x.resultado as string) >= x.criticoMaximo!,
        };
        return obj;
      });
    }

    setResultParam(captureResult === undefined ? [] : captureResult.parametros);
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

  const { width: windowWidth } = useWindowDimensions();
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
          <Row>
            <Col span={24}>
              <Row justify="space-between" gutter={[12, 24]}>
                {currentStudy.estatusId <= 3 ? (
                  ""
                ) : (
                  <Col span={12}>
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
                <Col span={12}>
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
                      ? "Validar estudio"
                      : currentStudy.estatusId === status.requestStudy.validado
                      ? "Liberar estudio"
                      : currentStudy.estatusId ===
                        status.requestStudy.solicitado
                      ? "Guardar captura"
                      : ""}
                  </Button>
                </Col>
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
    success = await updateResults(labResults);
    if (success) {
      setHideWhenCancel(false);
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
    valorFinal?: string
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
                          return (
                            <Row
                              key={field.key}
                              justify="space-between"
                              gutter={[0, 24]}
                              style={{ textAlign: "center" }}
                              align="middle"
                            >
                              {fieldValue.tipoValorId == "9" ? (
                                <Col span={24}>
                                  <br />
                                </Col>
                              ) : (
                                <>
                                  <Col span={4}>
                                    <h4>{fieldValue.nombre}</h4>
                                    {"\n"}
                                    <h5 style={{ color: "red" }}>
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
                                                fieldValue.tipoValorId
                                              );
                                            form.setFieldValue(
                                              [
                                                "parametros",
                                                field.name,
                                                "resultado",
                                              ],
                                              modal
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
                                        fieldKey={[field.key, "resultado"]}
                                        validateTrigger={["onChange", "onBlur"]}
                                        noStyle
                                      >
                                        {fieldValue.tipoValorId == "5" ? (
                                          <Select
                                            mode="multiple"
                                            options={fieldValue.tipoValores!.map(
                                              (x) => ({
                                                key: x.id,
                                                value: x.opcion!,
                                                label: x.opcion!,
                                              })
                                            )}
                                            style={{
                                              width: "80%",
                                              marginBottom: "7px",
                                            }}
                                          />
                                        ) : (
                                          <Input
                                            placeholder="Resultado"
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
                                          />
                                        )}
                                      </Form.Item>
                                    )}
                                  </Col>
                                  <Col span={4}>
                                    {fieldValue.ultimoResultado == null
                                      ? "-"
                                      : fieldValue.ultimoResultado}
                                  </Col>
                                  <Col span={4}>
                                    {fieldValue.unidadNombre == null
                                      ? "No cuenta con unidades"
                                      : fieldValue.unidadNombre}
                                  </Col>
                                  <Col span={4}>
                                    {fieldValue.valorInicial == null
                                      ? "No cuenta con valores de referencia"
                                      : referenceValues(
                                          fieldValue.tipoValorId,
                                          fieldValue.valorInicial,
                                          fieldValue.valorFinal
                                        )}
                                  </Col>
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
          {/* {resultParam.some((x) => x.rango) && !hideWhenCancel && (
            <Card className="capture-details">
              <Title level={4}>Valores Críticos</Title>
              <Row justify="space-between" style={{ textAlign: "center" }}>
                <Col span={8}>
                  <h3>EXAMEN</h3>
                </Col>
                <Col span={8}>
                  <h3>RESULTADO CRÍTICO</h3>
                </Col>
                <Col span={8}>
                  <h3>REFERENCIAS CRÍTICAS</h3>
                </Col>
              </Row>
              {resultParam?.map((x) =>
                x.rango ? (
                  <Row justify="space-between" style={{ textAlign: "center" }}>
                    <Col span={8}>
                      <h4>{x.nombre}</h4>
                    </Col>
                    <Col span={8}>
                      <h4 style={{ color: "red" }}>
                        {x.resultado} {x.unidadNombre}
                      </h4>
                    </Col>
                    <Col span={8}>
                      <h4>
                        {"<"} {x.criticoMinimo} - {x.criticoMaximo} {">"}
                      </h4>
                    </Col>
                  </Row>
                ) : null
              )}
            </Card>
          )} */}
          {/* {resultParam.some(
            (x) => x.deltaCheck && !!x.ultimoResultado && x.resultado
          ) &&
            !hideWhenCancel && (
              <Card className="capture-details">
                <Title level={4}>Análisis previo</Title>
                <Row>
                  <Col span={24}>
                    <Row
                      justify="space-between"
                      style={{ textAlign: "center" }}
                    >
                      <Col span={6}>
                        <h3>EXAMEN</h3>
                      </Col>
                      <Col span={6}>
                        <h4>RESULTADO ACTUAL</h4>
                      </Col>
                      <Col span={6}>
                        <h4>RESULTADO PREVIO</h4>
                      </Col>
                      <Col span={6}>
                        <h4>DIFERENCIA</h4>
                      </Col>
                      {resultParam?.map((x) =>
                        x.deltaCheck ? (
                          <>
                            <Col span={6}>
                              <h4>{x.nombre}</h4>
                            </Col>
                            <Col span={6}>
                              <h4>
                                {x.resultado} {x.unidadNombre}
                              </h4>
                            </Col>
                            <Col span={6}>
                              <h4>
                                {x.ultimoResultado} {x.unidadNombre}
                              </h4>
                            </Col>
                            <Col span={6}>
                              <h4>
                                {parseFloat(x.resultado) -
                                  parseFloat(x.ultimoResultado)}{" "}
                                {x.unidadNombre}
                              </h4>
                            </Col>
                          </>
                        ) : null
                      )}
                    </Row>
                  </Col>
                </Row>
              </Card>
            )} */}
        </Spin>
      ) : null}
    </Fragment>
  );
};
export default observer(ClinicalResultsDetail);
