import { Button, Table } from "antd";
import { ExpandableConfig } from "antd/lib/table/interface";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { IRequestedStudyList } from "../../app/models/requestedStudy";
import { useStore } from "../../app/stores/store";

type RequestedStudyTableProps = {
  data: IRequestedStudyList[];
  columns: IColumns<IRequestedStudyList>;
  expandable?: ExpandableConfig<IRequestedStudyList> | undefined;
};

const RequestedStudyTable = ({
  data,
  columns,
  expandable,
}: RequestedStudyTableProps) => {
  const { requestedStudyStore } = useStore();
  const { loadingStudies, getAll } = requestedStudyStore;
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

  const onExpand = (isExpanded: boolean, record: IRequestedStudyList) => {
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

  useEffect(() => {
    getAll({
      fecha: [moment(), moment()],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Table<IRequestedStudyList>
        loading={loadingStudies}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 450 }}
        expandable={{
          ...expandable,
          onExpand: onExpand,
          expandedRowKeys: expandedRowKeys,
        }}
        rowClassName={"row-search"}
        bordered
      />
    </Fragment>
  );
};

export default observer(RequestedStudyTable);
