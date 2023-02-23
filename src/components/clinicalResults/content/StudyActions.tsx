import { Row, Col, Button, Checkbox, Typography } from "antd";
import form from "antd/lib/form";
import { Fragment, useEffect, useState } from "react";
import request from "../../../app/api/request";
import { IRequest, IRequestStudy } from "../../../app/models/request";
import { status } from "../../../app/util/catalogs";
import alerts from "../../../app/util/alerts";
import { DownloadOutlined } from "@ant-design/icons";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Stats } from "fs";
import { IClinicResultCaptureForm } from "../../../app/models/clinicResults";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const { Text } = Typography;

type StudyActionsProps = {
  currentStudy: IRequestStudy;
  request?: IRequest | undefined;
  exportGlucoseData?: IClinicResultCaptureForm;
  setEnvioManual: (envioManual: boolean) => void;
  setCheckedPrint: (checkedPrint: boolean) => void;
  checkedPrint?: boolean;
  isMarked?: boolean;
  tipoEstudio: string;
  isXRay: boolean;
  submitResults: (
    esCancelacion: boolean,
    currentStudy: IRequestStudy
  ) => Promise<void>;
};

const StudyActions = ({
  currentStudy,
  request,
  setEnvioManual,
  setCheckedPrint,
  checkedPrint,
  isMarked,
  tipoEstudio,
  isXRay,
  exportGlucoseData,
  submitResults,
}: StudyActionsProps) => {
  const { clinicResultsStore } = useStore();
  const { exportGlucose, addSelectedStudy, removeSelectedStudy } =
    clinicResultsStore;
  const estudioCTG = currentStudy.estudioId == 631;

  useEffect(() => {
    setCheckedPrint(isMarked!);
    if (currentStudy.estatusId > status.requestStudy.capturado) {
      if (isMarked && tipoEstudio == "LABORATORY") {
        addSelectedStudy({ id: currentStudy.id!, tipo: "LABORATORY" });
      } else if (!isMarked && tipoEstudio == "LABORATORY") {
        removeSelectedStudy({
          id: currentStudy.id!,
          tipo: "LABORATORY",
        });
      } else if (isMarked && tipoEstudio == "PATHOLOGICAL") {
        addSelectedStudy({ id: currentStudy.id!, tipo: "PATHOLOGICAL" });
      } else if (!isMarked && tipoEstudio == "PATHOLOGICAL") {
        removeSelectedStudy({
          id: currentStudy.id!,
          tipo: "PATHOLOGICAL",
        });
      } else {
        return;
      }
    }
  }, [isMarked]);

  const saveTextButton = (estatus: number) => {
    const text = {
      [status.requestStudy.capturado]: "Validar",
      [status.requestStudy.validado]: "Liberar",
      [status.requestStudy.solicitado]: "Capturar",
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

  const updateButtonAction = (isCancel: boolean) => {
    if (!isCancel) {
      setEnvioManual(false);
      submitResults(false, currentStudy);
    } else {
      submitResults(true, currentStudy);
    }
  };

  const manualSubmission = async () => {
    if (request?.saldoPendiente) {
      alerts.confirm(
        "Solicitud con saldo pendiente",
        "¿Esta seguro que desea enviar el resultado?",
        async () => {
          setEnvioManual(true);
          submitResults(false, currentStudy);
        }
      );
    } else {
      setEnvioManual(true);
      submitResults(false, currentStudy);
    }
  };

  const exportGlucoseDataToExcel = async () => {
    await exportGlucose(exportGlucoseData!);
  };

  const selectToPrint = (value: CheckboxChangeEvent) => {
    if (value.target.checked && tipoEstudio == "LABORATORY") {
      addSelectedStudy({
        id: currentStudy.id!,
        tipo: "LABORATORY",
      });
      setCheckedPrint(true);
    } else if (!value.target.checked && tipoEstudio == "LABORATORY") {
      removeSelectedStudy({
        id: currentStudy.id!,
        tipo: "LABORATORY",
      });
      setCheckedPrint(false);
    } else if (value.target.checked && tipoEstudio == "PATHOLOGICAL") {
      addSelectedStudy({
        id: currentStudy.id!,
        tipo: "PATHOLOGICAL",
      });
      setCheckedPrint(true);
    } else if (!value.target.checked && tipoEstudio == "PATHOLOGICAL") {
      removeSelectedStudy({
        id: currentStudy.id!,
        tipo: "PATHOLOGICAL",
      });
      setCheckedPrint(false);
    } else {
      return;
    }
  };

  const studyTitle = (studyType: string, currentStudy: IRequestStudy) => {
    if (studyType == "PATHOLOGICAL") {
      let clave = currentStudy.areaId === 30 ? "HP" : "CITO";
      let nombre = currentStudy.areaId === 30 ? "HISTOPATOLOGÍA" : "CITOLOGÍA";
      return clave + " - " + nombre;
    }
    else {
      return currentStudy.clave + " - " + currentStudy.nombre;
    }
  };

  return (
    <Fragment>
      <Row justify="space-between" gutter={[24, 24]}>
        <Col span={!isXRay ? 12 : 24}>
          {!isXRay && (
            <Checkbox
              checked={
                currentStudy.estatusId < status.requestStudy.capturado
                  ? false
                  : checkedPrint
              }
              disabled={currentStudy.estatusId < status.requestStudy.capturado}
              onChange={(value) => selectToPrint(value)}
            ></Checkbox>
          )}
          <Text className="result-study">
            {studyTitle(tipoEstudio, currentStudy)}
          </Text>
        </Col>
        {!isXRay && (
          <Col span={12} style={{ textAlign: "right" }}>
            {currentStudy.estatusId >= status.requestStudy.solicitado &&
              currentStudy.estatusId <= status.requestStudy.liberado && (
                <>
                  {currentStudy.estatusId > status.requestStudy.solicitado && (
                    <Button
                      type="default"
                      disabled={disableButton(currentStudy.estatusId)}
                      onClick={() => updateButtonAction(true)}
                      danger
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={() => updateButtonAction(false)}
                  >
                    {saveTextButton(currentStudy.estatusId)}
                  </Button>
                  {currentStudy.estatusId === status.requestStudy.liberado && (
                    <Button
                      type="primary"
                      onClick={manualSubmission}
                      className="manual-submission"
                    >
                      Envio Manual
                    </Button>
                  )}
                  {estudioCTG &&
                    currentStudy.estatusId >= status.requestStudy.validado && (
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={exportGlucoseDataToExcel}
                      ></Button>
                    )}
                </>
              )}
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

export default observer(StudyActions);
