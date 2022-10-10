import "./css/containerInfo.less";
import {
  Collapse,
  Col,
  Form,
  Row,
  Spin,
  Typography,
  Checkbox,
  Divider,
  Button,
  Radio,
} from "antd";
import { observer } from "mobx-react-lite";
import DateInput from "../../app/common/form/proposal/DateInput";
import SelectInput from "../../app/common/form/SelectInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";
import { FC, useState, useEffect, Fragment } from "react";

import ClinicalResultsForm from "./observaciones/ClinicalResultsForm";
import ClinicalResultsDetails from "./desglose/ClinicalResultsDetail";
import { useNavigate } from "react-router";
import ClinicalResultsHeader from "./ClinicalResultsHeader";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { toJS } from "mobx";
import { IRequest, IRequestStudy } from "../../app/models/request";
import { v4 as uuid } from "uuid";

import { ProceedingFormValues } from "../../app/models/Proceeding";
import moment from "moment";
import React from "react";

const { Text } = Typography;
const { Panel } = Collapse;
type ClinicalFormProps = {
  printing: boolean;
};

type UrlParams = {
  expedienteId: string;
  requestId: string;
};

const ClinicalResultsInfo: FC<ClinicalFormProps> = ({ printing }) => {
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
  const { departmentOptions, getDepartmentOptions } = optionStore;
  const { studiesSelectedToPrint, printSelectedStudies } = clinicResultsStore;

  const [loading, setLoading] = useState(false);
  const [markAll, setMarkAll] = useState(false);
  const [dataClinicalResult, setDataClinicalResult] = useState<any>();
  const [currentStudies, setCurrentStudies] = useState<any>();
  const [printLogos, setPrintLogos] = useState(false);

  const [procedingCurrent, setProcedingCurrent] = useState<any>(
    new ProceedingFormValues()
  );

  const { expedienteId, requestId } = useParams<UrlParams>();

  useEffect(() => {
    const searchRequest = async () => {
      setLoading(true);
      await getDepartmentOptions();
      await getById(expedienteId!, requestId!);
      const procedingFound = await procedingById(expedienteId!);
      await getStudies(expedienteId!, requestId!);
      setDataClinicalResult({ ...request, ...procedingFound });
      setProcedingCurrent({ ...procedingFound });
      form.setFieldsValue({
        ...procedingFound,
        fechaNacimiento: moment(procedingFound?.fechaNacimiento),
        ...request,
      });
      setLoading(false);
    };
    searchRequest();
  }, [getById, procedingById]);

  useEffect(() => {
    form.setFieldsValue({
      ...dataClinicalResult,
      fechaNacimiento: moment(dataClinicalResult?.fechaNacimiento),
      ...request,
    });
  }, [request]);
  const navigate = useNavigate();

  const [form] = Form.useForm<any>();

  const sendToPrintSelectedStudies = async () => {
    const studiesToPrint = {
      solicidtudId: request?.solicitudId,
      estudios: studiesSelectedToPrint,
      imprimirLogos: printLogos,
    };
    await printSelectedStudies(studiesToPrint);
    console.log("sendToPrintSelectedStudies", toJS(studiesSelectedToPrint));
  };

  const isAnyStudySelected = () => {
    return studiesSelectedToPrint.length > 0;
  }

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <ClinicalResultsHeader printing={false} />
      <Divider orientation="left"></Divider>
      <Collapse ghost className="request-filter-collapse">
        <Panel header="Información de la solicitud" key="informationRequest">
          <div className="status-container">
            <Form
              form={form}
              name="clinicalResults"
              initialValues={dataClinicalResult}
              scrollToFirstError
            >
              <Row>
                <Col span={24}>
                  <Row justify="space-between" gutter={[0, 0]}>
                    <Col span={10}>
                      <TextInput
                        formProps={{ name: "nombre", label: "Nombre" }}
                        readonly={true}
                      />
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <TextInput
                        formProps={{ name: "nombreMedico", label: "Médico" }}
                        readonly={true}
                      />
                    </Col>
                    <Col span={4}>
                      <TextInput
                        formProps={{
                          name: "fechaNacimientoFormat",
                          label: "Fecha de Nacimiento",
                        }}
                        readonly={true}
                      />
                    </Col>

                    <Col span={2}>
                      <TextInput
                        formProps={{ name: "edad", label: "Edad" }}
                        readonly={true}
                      />
                    </Col>
                    <Col span={2}>
                      <SelectInput
                        formProps={{ name: "sexo", label: "Genero" }}
                        options={[]}
                        readonly={true}
                      />
                    </Col>
                    <Col span={3}>
                      <TextInput
                        formProps={{ name: "telefono", label: "Teléfono" }}
                        readonly={true}
                      />
                    </Col>
                    <Col span={3}>
                      <TextInput
                        formProps={{ name: "celular", label: "Celular" }}
                        readonly={true}
                      />
                    </Col>
                    <Col span={3} style={{ alignItems: "left" }}>
                      <Text key="expediente">
                        Expediente:{" "}
                        <Text strong>{dataClinicalResult?.expediente}</Text>
                      </Text>
                    </Col>
                    <Col span={10}>
                      <TextInput
                        formProps={{
                          name: "nombreCompania",
                          label: "Compañía",
                        }}
                        readonly={true}
                      />
                    </Col>

                    <Col span={12}>
                      <TextAreaInput
                        formProps={{
                          name: "observaciones",
                          label: "Observaciones",
                        }}
                        rows={3}
                        readonly={true}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </Panel>
      </Collapse>

      <Row>
        <Col span={12}>
          <Row>
            <Col span={8}>
              <Checkbox
                value="logos"
                onChange={(value) => {
                  console.log("value logos", value.target.checked);
                  if (value.target.checked) {
                    setPrintLogos(true);
                  } else {
                    setPrintLogos(false);
                  }
                }}
              >
                Imprimir logos
              </Checkbox>
            </Col>
            <Radio.Group
              onChange={(value) => {
                console.log("checked", value.target.value);
                if (value.target.value === "unmarked") {
                  setMarkAll(false);
                }
                if (value.target.value === "marked") {
                  setMarkAll(true);
                }
              }}
            >
              <Row>
                <Col span={12}>
                  <Radio value="unmarked">Desmarcar todos</Radio>
                </Col>
                <Col span={12}>
                  <Radio value="marked">Marcar todos</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Row>
        </Col>
        <Col span={6}>
          <Button
            style={{ marginLeft: "45%", marginBottom: "5%" }}
            type="primary"
            onClick={() => {
              printOrder(expedienteId!, requestId!);
            }}
          >
            Orden
          </Button>
        </Col>
        <Col span={6}>
          <Button
            style={{
              marginLeft: "45%",
              marginBottom: "5%",
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
            const idPatologia = departmentOptions.find(
              (dep) => dep.label === "PATOLOGÍA"
            )?.value;
            if (idPatologia === req.departamentoId) {
              return (
                <div key={req.id}>
                  <Divider orientation="left"></Divider>
                  <ClinicalResultsForm
                    estudio={req}
                    estudioId={req.estudioId}
                    paciente={procedingCurrent}
                    medico={request?.nombreMedico!}
                    claveMedico={request?.claveMedico!}
                    solicitud={request!}
                    isMarked={markAll}
                  />
                </div>
              );
            } else {
              return (
                <ClinicalResultsDetails
                  key={req.id}
                  estudio={req}
                  estudioId={req.estudioId}
                  paciente={procedingCurrent}
                  medico={request?.nombreMedico!}
                  claveMedico={request?.claveMedico!}
                  solicitud={request!}
                  isMarked={markAll}
                />
              );
            }
          })}
          {/* <ClinicalResultsForm /> */}
        </Col>
      </Row>
    </Spin>
  );
};
export default observer(ClinicalResultsInfo);
