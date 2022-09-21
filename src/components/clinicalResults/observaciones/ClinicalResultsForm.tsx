import { Button, Card, Col, Descriptions, Row, Table } from "antd";
import { observer } from "mobx-react-lite";
import { Typography } from "antd";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { IColumns } from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/SelectInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
const { Text, Title } = Typography;

const ClinicalResultsForm = () => {
  const { width: windowWidth } = useWindowDimensions();
  const columns: IColumns<any> = [
    {
      key: "Clave",
      dataIndex: "id",
      title: "Clave",
      align: "left",
      width: 100,
    },
    {
      key: "Clave",
      dataIndex: "id",
      title: "Estudio",
      align: "left",
      width: 200,
    },
    {
      key: "Orden",
      dataIndex: "id",
      title: "Orden",
      align: "left",
      width: 50,
    },
    {
      key: "Estatus",
      dataIndex: "id",
      title: "Estatus",
      align: "left",
      width: 50,
    },
    {
      key: "Estatus",
      dataIndex: "id",
      title: "Seleccionar",
      align: "left",
      width: 50,
    },
  ];
  return (
    <>
      <Row
        style={{
          marginBottom: "20px",
          padding: "5px",
          border: "3px solid black",
          width: "100%",
        }}
        justify="space-between"
        gutter={[2, 12]}
      >
        <Col span={6}>
          <Title level={5}>Estatus</Title>
          <div>
            <Text>Capturado</Text>
          </div>
          <div>
            <Text>Validado</Text>
          </div>
          <div>
            <Text>Liberado</Text>
          </div>
          <div>
            <Text>Enviado</Text>
          </div>
        </Col>
        <Col span={6}>
          <Title level={5}>Fecha de actualización</Title>
          <div>
            <Text></Text>
          </div>
          <div>
            <Text></Text>
          </div>
          <div>
            <Text></Text>
          </div>
          <div>
            <Text></Text>
          </div>
        </Col>
        <Col span={6}>
          <Button
            type="default"
            htmlType="submit"
            disabled={false}
            onClick={() => {}}
            danger
          >
            Cancelar validación
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={false}
            style={{ backgroundColor: "green" }}
            onClick={() => {}}
          >
            Liberar
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={[]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card className="capture-observartions">
            <Row justify="space-between" gutter={[2, 12]}>
              <Col span={8}>
                <Text key="expediente">
                  Medico: <Text strong></Text>
                </Text>
              </Col>
              <Col span={8}>
                <Text key="expediente">
                  Fecha: <Text strong></Text>
                </Text>
              </Col>
            </Row>
            <Row justify="space-between" gutter={[2, 12]}>
              <Col span={8}>
                <Text key="expediente">
                  Paciente: <Text strong></Text>
                </Text>
              </Col>
              <Col span={8}>
                <Text key="expediente">
                  Edad: <Text strong></Text>
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text key="expediente">
                  Estudio: <Text strong></Text>
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text key="expediente">
                  Clave: <Text strong></Text>
                </Text>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={6}>
                <Title level={5}>REPORTE DE ESTUDIO CITOLÓGICO</Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text key="expediente">
                  Muestra recibida: <Text strong></Text>
                </Text>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text key="expediente">DESCRIPCIÓN MACROSCÓPICA</Text>
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                  }}
                  rows={5}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text key="expediente">DESCRIPCIÓN MICROSCÓPICA</Text>
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                  }}
                  rows={5}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text key="expediente">DIAGNÓSTICO</Text>
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                  }}
                  rows={5}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={2}>
                <Text key="expediente">Atentamente.</Text>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={4}>
                <SelectInput
                  formProps={{
                    name: "compañia",
                    label: "Dr.",
                  }}
                  options={[]}
                  readonly={false}
                ></SelectInput>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default observer(ClinicalResultsForm);
