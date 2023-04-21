import { Row, Col, Typography } from "antd";

const { Text } = Typography;

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <Row>
    <Col md={24}>
      <Text strong>{title}</Text>
    </Col>
    <Col md={24}>
      <Text>{content}</Text>
    </Col>
  </Row>
);

export default DescriptionItem;
