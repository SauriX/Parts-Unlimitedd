import { Col, Row, Segmented } from "antd";
import React, { useState } from "react";
import { TagsOutlined, ProfileOutlined } from "@ant-design/icons";
import RequestPrintTag from "./print/RequestPrintTag";
import RequestPrintOrder from "./print/RequestPrintOrder";
import { SegmentedValue } from "antd/lib/segmented";

const segmentOptions = [
  {
    label: "Etiquetas",
    value: "tags",
    icon: <TagsOutlined />,
  },
  {
    label: "Orden",
    value: "order",
    icon: <ProfileOutlined />,
  },
];

const RequestPrint = () => {
  const [view, setView] = useState<"tags" | "order">("tags");

  const onChange = (value: SegmentedValue) => {
    const view = value.toString() as "tags" | "order";
    setView(view);
  };

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Segmented options={segmentOptions} onChange={onChange} />
      </Col>
      <Col span={24}>{view === "tags" ? <RequestPrintTag /> : <RequestPrintOrder />}</Col>
    </Row>
  );
};

export default RequestPrint;
