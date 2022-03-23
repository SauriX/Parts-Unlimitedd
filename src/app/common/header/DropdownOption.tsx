import { Col, Row, Typography } from "antd";
import React, { FC } from "react";

const { Text } = Typography;

type DropdownOptionProps = {
  option: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const DropdownOption: FC<DropdownOptionProps> = ({ option, icon, onClick }) => {
  return (
    <Row className="menu-options" onClick={onClick}>
      <Col span={6}>{icon}</Col>
      <Col span={18}>
        <Text>{option}</Text>
      </Col>
    </Row>
  );
};

export default DropdownOption;
