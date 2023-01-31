import { Table } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { FC, Fragment, useEffect } from "react";
import { IColumns } from "../../../app/common/table/utils";
import { ISeriesList } from "../../../app/models/series";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";

type SeriesTableProps = {
  series: ISeriesList[];
  columns: IColumns<ISeriesList>;
};

const SeriesTable: FC<SeriesTableProps> = ({ series, columns }) => {
  const { seriesStore } = useStore();
  const { loading } = seriesStore;

  return (
    <Fragment>
      <Table<ISeriesList>
        columns={columns}
        dataSource={series}
        loading={loading}
        rowKey={uuid()}
        size="small"
        pagination={false}
        scroll={{ x: 600 }}
        bordered
      />
    </Fragment>
  );
};

export default observer(SeriesTable);
