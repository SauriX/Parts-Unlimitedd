import { Button, Col, Row, Spin, Table } from "antd";
import { useState } from "react";
import { IColumns, getDefaultColumnProps } from "../../../../app/common/table/utils";
import { IRequestStudy } from "../../../../app/models/request";
import { useStore } from "../../../../app/stores/store";

const data = [
  {
    id: 1,
    clave: "TTA",
    texto: "TP",
    cantidad: 1,
  },
  {
    id: 2,
    clave: "TTL",
    texto: "TPT",
    cantidad: 1,
  },
  {
    id: 3,
    clave: "TTR",
    texto: "OSP",
    cantidad: 1,
  },
];

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const { printTicket } = requestStore;

  const [loading, setLoading] = useState<boolean>(false);

  const columns: IColumns<IRequestStudy> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchable: false,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("texto", "Texto", {
        searchable: false,
        width: "70%",
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
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={[...data]}
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
