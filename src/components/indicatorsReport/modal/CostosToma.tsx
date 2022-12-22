import { Space, Tag, Table } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { IReportIndicators } from "../../../app/models/indicators";
import CostoTomaColumns from "../columnDefinition/costotoma";

type CostosTomaProps = {
  data: IReportIndicators[];
  costoToma: number;
  loading: boolean;
};

const CostosToma = ({ data, costoToma, loading }: CostosTomaProps) => {
  return (
    <Space direction="vertical" size="middle">
      <Tag color="blue" className="table-tag">
        {costoToma}
      </Tag>
      <Table<IReportIndicators>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={CostoTomaColumns()}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 500 }}
        bordered
        rowClassName={"row-search"}
      />
    </Space>
  );
};

export default observer(CostosToma);
