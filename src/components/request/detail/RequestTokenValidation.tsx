import {
  faCircleCheck,
  faCodeCompare,
  faListCheck,
  faMessage,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Col, Input, Row, Steps, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { IColumns } from "../../../app/common/table/utils";
import { IRequestToken } from "../../../app/models/request";
import { IWeeAssignment } from "../../../app/models/weeClinic";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";

const { Link, Text } = Typography;

type RequestTokenValidationProps = {
  recordId: string;
  requestId: string;
};

const RequestTokenValidation = ({
  recordId,
  requestId,
}: RequestTokenValidationProps) => {
  const { requestStore } = useStore();
  const { sendWeeToken, compareWeeToken, verifyWeeToken, assignWeeServices } =
    requestStore;

  const [currentStep, setCurrentStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<{
    message: string;
    status: "info" | "error";
  }>({
    message: "Enviando código a paciente...",
    status: "info",
  });
  const [sending, setSending] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [code, setCode] = useState<string>();

  const columns: IColumns<IWeeAssignment> = [
    {
      dataIndex: "nombre",
      key: "nombre",
      title: "Nombre",
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link>{value}</Link>
          <small>
            <Text type="secondary">{item.clave}</Text>
          </small>
        </div>
      ),
    },
    {
      dataIndex: "mensaje",
      key: "mensaje",
      title: "Resultado",
    },
  ];

  const [services, setServices] = useState<IWeeAssignment[]>([]);

  const sendToken = useCallback(
    async (resend: boolean = false) => {
      if (recordId && requestId) {
        setCurrentStep(0);
        setCurrentStatus({
          message: "Enviando código a paciente...",
          status: "info",
        });

        const sendInfo: IRequestToken = {
          expedienteId: recordId,
          solicitudId: requestId,
          reenviar: resend,
        };

        setSending(true);

        const response = await sendWeeToken(sendInfo);
        if (!response) return;

        setCurrentStatus({
          message: response.dato + " " + response.mensaje,
          status: response.enviado ? "info" : "error",
        });

        if (response?.enviado) {
          setCurrentStep(1);
        }

        setSending(false);
      }
    },
    [recordId, requestId, sendWeeToken]
  );

  const compareToken = async () => {
    if (!code) {
      alerts.warning("Por favor, introduce el código");
    }

    setCurrentStatus({
      message: "Comparando código...",
      status: "info",
    });

    const compareInfo: IRequestToken = {
      expedienteId: recordId,
      solicitudId: requestId,
      token: code,
      reenviar: false,
    };

    setComparing(true);

    const response = await compareWeeToken(compareInfo);
    if (!response) return;

    setCurrentStatus({
      message: response.validado
        ? "Código comparado exitosamente"
        : response.dato,
      status: response.validado ? "info" : "error",
    });

    if (response && response.validado) {
      setCurrentStep(2);
      verifyToken(compareInfo);
    }

    setComparing(false);
  };

  const verifyToken = async (compareInfo: IRequestToken) => {
    setCurrentStatus({
      message: "Validando código...",
      status: "info",
    });

    setVerifying(true);

    const response = await verifyWeeToken(compareInfo);
    if (!response) return;

    setCurrentStatus({
      message: response.verificado
        ? "Código validado exitosamente"
        : response.mensaje,
      status: response.verificado ? "info" : "error",
    });

    if (response && response.verificado) {
      setCurrentStep(3);
      assignServices(compareInfo);
    } else {
      setCurrentStep(1);
    }

    setVerifying(false);
  };

  const assignServices = async (compareInfo: IRequestToken) => {
    setCurrentStatus({
      message: "Asignando estudios a laboratorio...",
      status: "info",
    });

    setAssigning(true);

    const response = await assignWeeServices(
      compareInfo.expedienteId,
      compareInfo.solicitudId
    );

    setServices(response);
    setCurrentStatus({
      message: "Resultados de asignación",
      status: "info",
    });

    setAssigning(false);
  };

  useEffect(() => {
    sendToken();
  }, [sendToken]);

  const steps = [
    {
      title: "Envío",
      icon: (
        <FontAwesomeIcon
          spin={sending}
          icon={sending ? faSpinner : faMessage}
        />
      ),
      content: (
        <Alert message={currentStatus.message} type={currentStatus.status} />
      ),
    },
    {
      title: "Comparación",
      icon: (
        <FontAwesomeIcon
          spin={comparing}
          icon={comparing ? faSpinner : faCodeCompare}
        />
      ),
      content: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message={currentStatus.message}
              type={currentStatus.status}
            />
          </Col>
          <Col span={24}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresar código recibido"
            />
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Link onClick={() => sendToken()}>Nuevo código</Link>
            <Link style={{ marginLeft: 8 }} onClick={() => sendToken(true)}>
              Reenviar código
            </Link>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              onClick={compareToken}
            >
              Confirmar
            </Button>
          </Col>
        </Row>
      ),
    },
    {
      title: "Validación",
      icon: (
        <FontAwesomeIcon
          spin={verifying}
          icon={verifying ? faSpinner : faCircleCheck}
        />
      ),
      content: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message={currentStatus.message}
              type={currentStatus.status}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: "Asignación",
      icon: (
        <FontAwesomeIcon
          spin={assigning}
          icon={assigning ? faSpinner : faListCheck}
        />
      ),
      content: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message={currentStatus.message}
              type={currentStatus.status}
            />
          </Col>
          {services && services.length > 0 && (
            <Col span={24}>
              <Table<IWeeAssignment>
                rowKey={(record) => record.idServicio}
                columns={columns}
                dataSource={services}
                pagination={false}
                sticky
                scroll={{ x: "auto", y: 500 }}
              />
            </Col>
          )}
        </Row>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 120 }}>
      <Steps
        current={currentStep}
        size="small"
        className="wee-token-validation-step"
        items={steps}
      />
      {steps[currentStep].content}
    </div>
  );
};

export default observer(RequestTokenValidation);
