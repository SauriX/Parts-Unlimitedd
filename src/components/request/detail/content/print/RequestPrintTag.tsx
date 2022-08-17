import { Button, Col, Row, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { IColumns, getDefaultColumnProps } from "../../../../../app/common/table/utils";
import { IRequestStudy } from "../../../../../app/models/request";
import { useStore } from "../../../../../app/stores/store";

interface IRequestTag {
  taponClave: string;
  taponNombre: string;
  estudios: string;
  cantidad: number;
}

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const { allStudies, printTicket } = requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
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
            dataSource={[...labels]}
            pagination={false}
            rowSelection={{
              fixed: "right",
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="default"
            onClick={async () => {
              setLoading(true);
              await printTicket("", "");
              setLoading(false);
            }}
          >
            Imprimir
          </Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default RequestPrintTag;
