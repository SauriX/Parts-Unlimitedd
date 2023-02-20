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
  checkedPrint: boolean;
  isMarked: boolean;
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
  exportGlucoseData,
  submitResults,
}: StudyActionsProps) => {
  const { clinicResultsStore } = useStore();
  const { exportGlucose, addSelectedStudy, removeSelectedStudy } =
    clinicResultsStore;
  const estudioCTG = currentStudy.estudioId == 631;

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

  const saveTextButton = (estatus: number) => {
    const text = {
      [status.requestStudy.capturado]: "Validar",
      [status.requestStudy.validado]: "Liberar",
      [status.requestStudy.solicitado]: "Capturar",
    };
    return text[estatus];
  };

  const cancelTextButton = (estatus: number) => {
    const text = {
      [status.requestStudy.capturado]: "Cancelar",
      [status.requestStudy.validado]: "Cancelar",
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
  };

  return (
    <Fragment>
      <Row justify="space-between" gutter={[24, 24]}>
        <Col span={12}>
          <Checkbox
            checked={
              currentStudy.estatusId < status.requestStudy.capturado
                ? false
                : checkedPrint
            }
            disabled={currentStudy.estatusId < status.requestStudy.capturado}
            onChange={(value) => selectToPrint(value)}
          ></Checkbox>
          <Text className="result-study">
            {currentStudy.clave} - {currentStudy.nombre}
          </Text>
        </Col>
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
                    {cancelTextButton(currentStudy.estatusId)}
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
      </Row>
    </Fragment>
  );
};

export default observer(StudyActions);
