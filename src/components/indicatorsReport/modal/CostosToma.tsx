import { Space, Tag, Table } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { IReportIndicators, ISamplesCost } from "../../../app/models/indicators";
import CostoTomaColumns from "../columnDefinition/costotoma"

type CostosTomaProps = {
  samples: ISamplesCost[];
  costoToma: number;
  loading: boolean;
};

const CostosToma = ({ samples, costoToma, loading }: CostosTomaProps) => {
  return (
    <Space direction="vertical" size="small">
      <div style={{textAlign: "right", marginTop: 10}}>
        <Tag color="blue" className="table-tag">
          Costo Toma actual: {costoToma}
        </Tag>
      </div>
      <Table<ISamplesCost>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={CostoTomaColumns()}
        pagination={false}
        dataSource={[...samples]}
        scroll={{ y: 500 }}
        bordered
        rowClassName={"row-search"}
      />
    </Space>
  );
};

export default observer(CostosToma);
