import { Button, Col, Row, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import {
  TagsOutlined,
  ProfileOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import RequestPrintTag from "./print/RequestPrintTag";
import RequestPrintOrder from "./print/RequestPrintOrder";
import { SegmentedValue } from "antd/lib/segmented";
import RequestPrintConsent from "./print/RequestPrintConsent";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import { catalog } from "../../../../app/util/catalogs";

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
  const { requestStore } = useStore();
  const { allStudies } = requestStore;

  const [tabs, setTabs] = useState(segmentOptions);
  const [view, setView] = useState<"tags" | "order" | "format">("tags");

  const onChange = (value: SegmentedValue) => {
    const view = value.toString() as "tags" | "order" | "format";
    setView(view);
  };

  useEffect(() => {
    const canPrintFormat = allStudies.some(
      (x) => x.areaId === catalog.area.dop || x.areaId === catalog.area.vdrl
    );

    if (canPrintFormat) {
      setTabs((prev) => [
        ...prev,
        {
          label: "Formato",
          value: "format",
          icon: <FilePdfOutlined />,
        },
      ]);
    } else {
      setTabs((prev) => prev.filter((x) => x.value !== "format"));
    }
  }, [allStudies]);

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Segmented options={tabs} onChange={onChange} />
      </Col>
      <Col span={24}>
        {view === "tags" ? (
          <RequestPrintTag />
        ) : view === "order" ? (
          <RequestPrintOrder />
        ) : (
          <RequestPrintConsent />
        )}
      </Col>
    </Row>
  );
};

export default observer(RequestPrint);
