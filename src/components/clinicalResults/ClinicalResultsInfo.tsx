import "./css/containerInfo.less";
import {
  Col,
  Row,
  Spin,
  Typography,
  Checkbox,
  Divider,
  Button,
  Radio,
  Affix,
  Tag,
} from "antd";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import ClinicalResultsForm from "./observaciones/ClinicalResultsForm";
import ClinicalResultsDetails from "./desglose/ClinicalResultsDetail";
import ClinicalResultsHeader from "./ClinicalResultsHeader";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { IRequestStudy } from "../../app/models/request";
import {
  IProceedingForm,
  ProceedingFormValues,
} from "../../app/models/Proceeding";
import ClinicalResultsXRay from "./desglose/ClinicalResultsXRay";
import moment from "moment";
import {
  MedicineBoxTwoTone,
  FileTextTwoTone,
  MobileTwoTone,
  PhoneTwoTone,
  BankTwoTone,
  CalendarTwoTone,
  ReconciliationTwoTone,
} from "@ant-design/icons";

const { Text, Title } = Typography;

type UrlParams = {
  expedienteId: string;
  requestId: string;
};

const ClinicalResultsInfo = () => {
  const {
    requestStore,
    procedingStore,
    optionStore,
    requestedStudyStore,
    clinicResultsStore,
  } = useStore();
  const { request, getById, studies, getStudies } = requestStore;
  const { getById: procedingById } = procedingStore;
  const { printOrder } = requestedStudyStore;
  const { getDepartmentOptions } = optionStore;
  const {
    studiesSelectedToPrint,
    printSelectedStudies,
    getStudies: getStudiesParams,
    clearSelectedStudies,
  } = clinicResultsStore;

  const [printing, setPrinting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markAll, setMarkAll] = useState(false);
  const [dataClinicalResult, setDataClinicalResult] = useState<any>();

  const [printLogos, setPrintLogos] = useState(false);
  const [printCritics, setPrintCritics] = useState(false);
  const [printPrevious, setPrintPrevious] = useState(false);

  const [procedingCurrent, setProcedingCurrent] = useState<any>(
    new ProceedingFormValues()
  );

  const [currentRecord, setCurrentRecord] = useState<IProceedingForm>(
    new ProceedingFormValues()
  );
  const { expedienteId, requestId } = useParams<UrlParams>();

  useEffect(() => {
    const searchRequest = async () => {
      setLoading(true);
      const record = await procedingById(expedienteId!);
      if (record) setCurrentRecord(record);

      await getDepartmentOptions();
      await getById(expedienteId!, requestId!, "results");
      await getStudies(expedienteId!, requestId!);
      await getStudiesParams(expedienteId!, requestId!);

      setDataClinicalResult({ ...request, ...record });
      setProcedingCurrent({ ...record });
      setLoading(false);
    };

    searchRequest();
  }, [getById, procedingById, expedienteId, requestId]);

  const sendToPrintSelectedStudies = async () => {
    setPrinting(true);
    const studiesToPrint = {
      solicidtudId: request?.solicitudId,
      estudios: studiesSelectedToPrint,
      imprimirLogos: printLogos,
      imprimirCriticos: printCritics,
      imprimirPrevios: printPrevious,
    };

    await printSelectedStudies(studiesToPrint);
    setPrinting(false);
  };

  const isAnyStudySelected = () => {
    return studiesSelectedToPrint.length <= 0;
  };

  let descriptionAge =
    moment(currentRecord.fechaNacimiento).year === moment().year
      ? " años"
      : " meses";

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <ClinicalResultsHeader printing={false} />
      <Divider orientation="left" className="header-divider"></Divider>
      <div className="recordInfo-container">
        <Row justify="space-between">
          <Col span={6}>
            <Title level={5} className="clinicTitle">
              {currentRecord.nombre + " " + currentRecord.apellido}{" "}
              <Tag color="geekblue">{currentRecord.sexo}</Tag>
            </Title>
          </Col>
          <Col span={6}>
            <MedicineBoxTwoTone />
            <Text strong>{" Médico: "}</Text>
            {request?.nombreMedico}
          </Col>
          <Col span={6}>
            <BankTwoTone />
            <Text strong>{" Compañía: "}</Text>
            {request?.nombreCompania}
          </Col>
          <Col span={6}>
            <FileTextTwoTone />
            <Text strong>{" Expediente: "}</Text>
            {currentRecord.expediente}
          </Col>
          <Col span={6}>
            <Text>{currentRecord.edad + descriptionAge}</Text>
          </Col>
          <Col span={6}>
            <CalendarTwoTone />
            <Text strong>{" Fecha de nacimiento: "}</Text>
            {moment(currentRecord.fechaNacimiento).format("DD/MM/yyyy")}
          </Col>
          <Col span={6}>
            <PhoneTwoTone />
            <Text strong>{" Teléfono: "}</Text>
            {currentRecord.telefono}
          </Col>
          <Col span={6}>
            <MobileTwoTone />
            <Text strong>{" Celular: "}</Text>
            {currentRecord.celular}
          </Col>
          {request?.observaciones && (
            <Col span={18} offset={6}>
              <ReconciliationTwoTone />
              <Text strong>{" Observaciones: "}</Text>
              {request?.observaciones}
            </Col>
          )}
        </Row>
      </div>

      <Row style={{ marginBottom: "1%" }}>
        <Col span={15}>
          <Row>
            <Col span={5}>
              <Checkbox
                value="logos"
                onChange={(value) => {
                  if (value.target.checked) {
                    setLoading(true);
                    setPrintLogos(true);
                    setLoading(false);
                  } else {
                    setPrintLogos(false);
                  }
                }}
              >
                Imprimir logos
              </Checkbox>
            </Col>
            <Col span={5}>
              <Checkbox
                value="logos"
                onChange={(value) => {
                  if (value.target.checked) {
                    setLoading(true);
                    setPrintPrevious(true);
                    setLoading(false);
                  } else {
                    setPrintPrevious(false);
                  }
                }}
              >
                Mostrar resultados previos
              </Checkbox>
            </Col>
            <Col span={5}>
              <Checkbox
                value="logos"
                onChange={(value) => {
                  if (value.target.checked) {
                    setLoading(true);
                    setPrintCritics(true);
                    setLoading(false);
                  } else {
                    setPrintCritics(false);
                  }
                }}
              >
                Mostrar críticos
              </Checkbox>
            </Col>
            <Radio.Group
              onChange={(value) => {
                if (value.target.value === "unmarked") {
                  setMarkAll(false);
                  clearSelectedStudies();
                }
                if (value.target.value === "marked") {
                  setMarkAll(true);
                }
              }}
            >
              <Row>
                <Col span={24}>
                  <Radio value="unmarked">Desmarcar todos</Radio>
                  <Radio value="marked">Marcar todos</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Row>
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => {
              printOrder(expedienteId!, requestId!);
            }}
          >
            Orden
          </Button>
          <Button
            style={{
              backgroundColor: "#B4C7E7",
              // color: "white",
            }}
            type="default"
            onClick={sendToPrintSelectedStudies}
            disabled={isAnyStudySelected()}
          >
            Imprimir
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          {studies.map((req: IRequestStudy, index: any) => {
            if (req.tipo === "PATOLOGICO") {
              return (
                <div key={req.identificador}>
                  <ClinicalResultsForm
                    estudio={req}
                    estudioId={req.estudioId}
                    paciente={procedingCurrent}
                    medico={request?.nombreMedico!}
                    claveMedico={request?.claveMedico!}
                    solicitud={request!}
                    isMarked={markAll}
                    showHeaderTable={index === 0}
                  />
                </div>
              );
            } else if (req.tipo === "LABORATORIO") {
              return (
                <ClinicalResultsDetails
                  key={req.identificador}
                  estudio={req}
                  estudioId={req.estudioId}
                  paciente={procedingCurrent}
                  medico={request?.nombreMedico!}
                  claveMedico={request?.claveMedico!}
                  solicitud={request!}
                  isMarked={markAll}
                  printing={loading}
                  showHeaderTable={index === 0}
                />
              );
            } else {
              return (
                <ClinicalResultsXRay
                  key={req.identificador}
                  study={req}
                  request={request!}
                  record={procedingCurrent}
                />
              );
            }
          })}
        </Col>
      </Row>
    </Spin>
  );
};
export default observer(ClinicalResultsInfo);

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
