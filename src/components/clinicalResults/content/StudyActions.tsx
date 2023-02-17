import { Row, Col, Button } from "antd";
import form from "antd/lib/form";
import { Fragment, useState } from "react";
import request from "../../../app/api/request";
import { IRequest, IRequestStudy } from "../../../app/models/request";
import { status } from "../../../app/util/catalogs";
import alerts from "../../../app/util/alerts";
import { DownloadOutlined } from "@ant-design/icons";
import { useStore } from "../../../app/stores/store";

type StudyActionsProps = {
  currentStudy: IRequestStudy;
  request?: IRequest | undefined;
};

const StudyActions = ({ currentStudy, request }: StudyActionsProps) => {
  const { clinicResultsStore } = useStore();
  const { updateStatusStudy, removeSelectedStudy, exportGlucose } = clinicResultsStore;
  
  const [loading, setLoading] = useState(false);
  const estudioCTG = currentStudy.estudioId == 631;

  const saveTextButton = (estatus: number) => {
    const text = {
      [status.requestStudy.capturado]: "Validar estudio",
      [status.requestStudy.validado]: "Liberar estudio",
      [status.requestStudy.solicitado]: "Guardar captura",
    };
    return text[estatus];
  };

  const cancelTextButton = (estatus: number) => {
    const text = {
      [status.requestStudy.capturado]: "Cancelar Captura",
      [status.requestStudy.validado]: "Cancelar Validación",
    };
    return text[estatus];
  };

  const disableButton = (estatus: number) => {
    const disable = {
      [status.requestStudy.tomaDeMuestra]: true,
      [status.requestStudy.pendiente]: true,
    };
    return disable[estatus];
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

  return (
    <Fragment>
      {currentStudy.estatusId >= status.requestStudy.solicitado &&
      currentStudy.estatusId <= status.requestStudy.liberado ? (
        <Row>
          <Col span={24}>
            <Row justify="space-between" gutter={[12, 24]}>
              {currentStudy.estatusId <= 3 ? (
                ""
              ) : (
                <>
                  <Col
                    span={
                      estudioCTG
                        ? 8
                        : currentStudy.estatusId == status.requestStudy.liberado
                        ? 6
                        : 12
                    }
                  >
                    <Button
                      type="default"
                      htmlType="submit"
                      disabled={disableButton(currentStudy.estatusId)}
                      onClick={async () => {
                        setLoading(true);
                        await updateStatus(true);
                        setLoading(false);
                      }}
                      danger
                    >
                      {cancelTextButton(currentStudy.estatusId)}
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
                  {saveTextButton(currentStudy.estatusId)}
                </Button>
              </Col>
              {currentStudy.estatusId === status.requestStudy.liberado ? (
                <Col
                  span={
                    estudioCTG
                      ? 8
                      : currentStudy.estatusId == status.requestStudy.liberado
                      ? 6
                      : 12
                  }
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={async () => {
                      if (request?.saldoPendiente) {
                        alerts.confirm(
                          "Solicitud con saldo pendiente",
                          "¿Esta seguro que desea enviar el resultado?",
                          async () => {
                            setEnvioManual(true);
                            form.submit();
                          }
                        );
                      } else {
                        setEnvioManual(true);
                        form.submit();
                      }
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
              {estudioCTG && currentStudy.estatusId >= 5 ? (
                <Col
                  span={
                    estudioCTG
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
    </Fragment>
  );
};

export default StudyActions;
