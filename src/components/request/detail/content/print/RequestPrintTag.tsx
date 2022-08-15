import { Button, Col, Row, Spin, Table } from "antd";
import { useState } from "react";
import { IColumns, getDefaultColumnProps } from "../../../../../app/common/table/utils";
import { IRequestStudy } from "../../../../../app/models/request";
import { useStore } from "../../../../../app/stores/store";

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const { allStudies, printTicket } = requestStore;

  const [loading, setLoading] = useState<boolean>(false);

  const columns: IColumns<IRequestStudy> = [
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
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
      ...getDefaultColumnProps("taponNombre", "Texto", {
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
          <Table<any>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={[...allStudies]}
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
