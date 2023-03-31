import { Row, Col } from "antd";
import React from "react";

const TitleColumns = () => {
  return (
    <Row justify="space-between" style={{ textAlign: "center" }}>
      <Col span={4}>
        <h3>EXAMEN</h3>
      </Col>
      <Col span={4}>
        <h3>RESULTADO</h3>
      </Col>
      <Col span={4}>
        <h3>UNIDADES</h3>
      </Col>
      <Col span={4}>
        <h3>REFERENCIA</h3>
      </Col>
      <Col span={4}>
        <h3>PREVIO</h3>
      </Col>
    </Row>
  );
};

export default TitleColumns;
