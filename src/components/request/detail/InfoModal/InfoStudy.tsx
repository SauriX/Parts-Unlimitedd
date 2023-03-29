import { Row, Col, Divider, Spin, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { IStudyDatasheet } from "../../../../app/models/study";
import TextArea from "antd/lib/input/TextArea";

const { Text } = Typography;

type Props = {
  id: number;
  originBranch: string;
  destinationBranch: string;
};

const InfoStudy = ({ id, originBranch, destinationBranch }: Props) => {
  const { studyStore } = useStore();
  const { getTecInfoById } = studyStore;

  const [study, setStudy] = useState<IStudyDatasheet>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const readInfoStudy = async () => {
      setLoading(true);
      var study = await getTecInfoById(id);
      setLoading(false);
      if (!study) return;
      setStudy(study);
    };

    readInfoStudy();
  }, [getTecInfoById, id, setStudy]);

  const TextWithLineBreaks = ({ text }: { text: string }) => {
    const lines = text.split("\n");
    const elements = lines.map((line, index) => (
      <div key={index}>
        {line}
        {index !== lines.length - 1 && <br />}
      </div>
    ));
    return <div>{elements}</div>;
  };

  return (
    <>
      <Text className="primary-color">{study?.nombre}</Text>
      <Divider className="header-divider" />
      <Spin spinning={loading} tip={""}>
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Text strong>Sucursal:</Text> {originBranch}
          </Col>
          <Col span={8}>
            <Text strong>Sucursal destino:</Text> {destinationBranch}
          </Col>
          <Col span={8}>
            <Text strong>Días de entrega:</Text> {study?.diasEntrega}
          </Col>
          <Col span={16}>
            <Text strong>Tipo de muestra:</Text> {study?.tipoMuestra}
          </Col>
          <Col span={8}>
            <Text strong>Días de estabilidad en medio ambiente:</Text>{" "}
            {study?.diasEstabilidad}
          </Col>
          <Col span={16}>
            <Text strong>Tubo de muestra:</Text> {study?.tapon}
          </Col>
          <Col span={8}>
            <Text strong>Días de estabilidad en refrigeración:</Text>{" "}
            {study?.diasRefrigeracion}
          </Col>
          <Col span={24}>
            <Text strong>Instrucciones de toma:</Text>
            <TextArea autoSize disabled value={study?.instrucciones} />
          </Col>
        </Row>
      </Spin>
    </>
  );
};
export default observer(InfoStudy);
