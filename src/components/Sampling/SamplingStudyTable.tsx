import { Button, Table } from "antd";
import { ExpandableConfig } from "antd/lib/table/interface";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { ISamplingList } from "../../app/models/sampling";
import { useStore } from "../../app/stores/store";

type RequestedStudyTableProps = {
  data: ISamplingList[];
  columns: IColumns<ISamplingList>;
  expandable?: ExpandableConfig<ISamplingList> | undefined;
};

const SamplingStudyTable = ({
  data,
  columns,
  expandable,
}: RequestedStudyTableProps) => {
  const { samplingStudyStore } = useStore();
  const { loadingStudies } = samplingStudyStore;
  const [openRows, setOpenRows] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    setExpandedRowKeys(data.map((x) => x.id));
    setOpenRows(true);
  }, [data]);

  const toggleRow = () => {
    if (openRows) {
      setOpenRows(false);
      setExpandedRowKeys([]);
    } else {
      setOpenRows(true);
      setExpandedRowKeys(data.map((x) => x.id));
    }
  };

  const onExpand = (isExpanded: boolean, record: ISamplingList) => {
    let expandRows: string[] = expandedRowKeys;
    if (isExpanded) {
      expandRows.push(record.id);
    } else {
      const index = expandRows.findIndex((x) => x === record.id);
      if (index > -1) {
        expandRows.splice(index, 1);
      }
    }
    setExpandedRowKeys(expandRows);
  };

  return (
    <Fragment>
      {data.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Button
            type="primary"
            onClick={toggleRow}
            style={{ marginRight: 10 }}
          >
            {!openRows ? "Abrir tabla" : "Cerrar tabla"}
          </Button>
        </div>
      )}
      <Table<ISamplingList>
        loading={loadingStudies}
        size="middle"
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        dataSource={[...data]}
        rowClassName={"row-search"}
        scroll={{ y: 450 }}
        expandable={{
          ...expandable,
          onExpand: onExpand,
          expandedRowKeys: expandedRowKeys,
        }}
      />
    </Fragment>
  );
};

export default observer(SamplingStudyTable);
