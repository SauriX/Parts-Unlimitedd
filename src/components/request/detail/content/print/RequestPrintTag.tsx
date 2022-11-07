import { Button, Col, InputNumber, Row, Spin, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  IColumns,
  getDefaultColumnProps,
} from "../../../../../app/common/table/utils";
import { IRequestStudy, IRequestTag } from "../../../../../app/models/request";
import { useStore } from "../../../../../app/stores/store";

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const { request, allStudies, printTags } = requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const grouped = allStudies.reduce((group: IRequestTag[], study) => {
      const index = group.findIndex((x) => x.taponClave === study.taponClave);
      if (index === -1) {
        group.push({
          taponClave: study.taponClave,
          taponNombre: study.taponNombre,
          cantidad: 1,
          estudios: study.clave,
        });
      } else {
        group[index].estudios += `, ${study.clave}`;
      }
      return group;
    }, []);
    setLabels(grouped);
  }, [allStudies]);

  const changeQty = (qty: number, record: IRequestTag) => {
    let index = labels.findIndex((x) => x.taponClave === record.taponClave);
    if (index > -1) {
      const lbls = [...labels];
      lbls[index] = { ...lbls[index], cantidad: qty };
      setLabels(lbls);
    }
  };

  const print = async () => {
    if (request) {
      setLoading(true);
      const toPrint = labels.filter((x) => selectedKeys.includes(x.taponClave));
      await printTags(request.expedienteId, request.solicitudId!, toPrint);
      setLoading(false);
    }
  };

  const columns: IColumns<IRequestTag> = [
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchable: false,
        width: "50%",
      }),
    },
    {
      ...getDefaultColumnProps("taponClave", "Clave", {
        searchable: false,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("taponNombre", "Tapón", {
        searchable: false,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cant.", {
        searchable: false,
        width: "10%",
      }),
      render: (_, record) => (
        <InputNumber
          value={record.cantidad}
          bordered={false}
          min={1}
          style={{ width: "100%" }}
          onChange={(qty) => {
            changeQty(qty, record);
          }}
        />
      ),
    },
    Table.SELECTION_COLUMN,
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24}>
          <Table<IRequestTag>
            size="small"
            rowKey={(record) => record.taponClave}
            columns={columns}
            dataSource={labels}
            pagination={false}
            rowSelection={{
              fixed: "right",
              selectedRowKeys: selectedKeys,
              onSelect: (r, s, selected) => {
                setSelectedKeys(selected.map((x) => x.taponClave));
              },
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            disabled={selectedKeys.length === 0}
            type="default"
            onClick={print}
          >
            Imprimir
          </Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RequestPrintTag);
