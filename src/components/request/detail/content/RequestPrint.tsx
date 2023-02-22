import { Button, Col, Dropdown, Row, Segmented, Space } from "antd";
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
import { DownOutlined } from "@ant-design/icons";

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
  const { allStudies, distinctTags, addTag } = requestStore;

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
      if (tabs.findIndex((x) => x.value === "format") === -1) {
        setTabs((prev) => [
          ...prev,
          {
            label: "Formato",
            value: "format",
            icon: <FilePdfOutlined />,
          },
        ]);
      }
    } else {
      setTabs((prev) => prev.filter((x) => x.value !== "format"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStudies]);

  return (
    <Row gutter={[12, 12]}>
      <Col span={12}>
        <Segmented size="small" options={tabs} onChange={onChange} />
      </Col>
      {view === "tags" && (
        <Col span={12} style={{ textAlign: "right" }}>
          <Dropdown
            placement="bottomRight"
            menu={{
              items: distinctTags.map((x) => ({
                key: x.etiquetaId,
                label: x.claveEtiqueta + " " + x.nombreEtiqueta,
              })),
              onClick: ({ key }) =>
                addTag(
                  distinctTags.find((x) => x.etiquetaId.toString() === key)!
                ),
            }}
          >
            <Button type="primary">
              <Space>
                Agregar etiqueta
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Col>
      )}
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
