import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { IProceedingForm } from "../../../app/models/Proceeding";
import {
  IRequest,
  IRequestStudy,
  RequestStudyValues,
} from "../../../app/models/request";
import { CopyOutlined } from "@ant-design/icons";
import StudyActions from "../content/StudyActions";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";

const { Text } = Typography;

type CRXRProps = {
  study: IRequestStudy;
  record: IProceedingForm;
  request: IRequest;
};

const ClinicalResultsXRay = ({ study, record, request }: CRXRProps) => {
  const { clinicResultsStore } = useStore();
  const { getRequestStudyById } = clinicResultsStore;

  const [currentStudy, setCurrentStudy] = useState<IRequestStudy>(
    new RequestStudyValues()
  );

  const loadStudy = async () => {
    const requestStudy = await getRequestStudyById(study.id!);
    setCurrentStudy(requestStudy);
  };

  useEffect(() => {
    loadStudy();
    console.log("currentStudy", currentStudy);
  }, [getRequestStudyById, study]);

  return (
    <Fragment>
      <Row gutter={[24, 24]} className="study-divider">
        <Col span={24}>
          <StudyActions
            currentStudy={currentStudy}
            setEnvioManual={() => {}}
            setCheckedPrint={() => {}}
            tipoEstudio="IMAGENOLOGIA"
            isXRay={true}
            submitResults={async () => void 0}
          />
        </Col>
      </Row>
      <Card className="capture-xray">
        <Row gutter={[24, 12]}>
          <Col span={12}>
            <Text key={uuid()} strong>
              Médico: {request?.nombreMedico}{" "}
            </Text>
          </Col>
          <Col span={12}>
            <Text key={uuid()} strong>
              Paciente: {record?.nombre}
            </Text>
          </Col>
          <Col span={12}>
            <Text key={uuid()} strong>
              Estatus: {study?.estatus}
            </Text>
          </Col>
          <Col span={12}>
            <Text key={uuid()} strong>
              Edad: {record?.edad}
            </Text>
          </Col>
          <Col span={12}>
            <Input.Group compact>
              <Input
                style={{ width: "calc(100% - 500px)" }}
                name="Enlance"
                placeholder="https://laboratorioramos.com"
              />
              <Tooltip title="Copiar enlance">
                <Button icon={<CopyOutlined />} />
              </Tooltip>
            </Input.Group>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
};

export default observer(ClinicalResultsXRay);
