import { Row, Col, Typography } from "antd";
import "./description.less"

const { Text, Title } = Typography;

interface DescriptionTitleProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionTitle = ({ title, content }: DescriptionTitleProps) => (
  <Row>
    <Col md={24}>
      <Text className="description-text">{title}</Text>
    </Col>
    <Col md={24}>
      <Title level={5}>{content}</Title>
    </Col>
  </Row>
);

export default DescriptionTitle;
