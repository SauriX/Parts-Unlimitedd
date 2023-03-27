import { Button, Table } from "antd";
import { ExpandableConfig } from "antd/lib/table/interface";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { IClinicResultList } from "../../app/models/clinicResults";
import { useStore } from "../../app/stores/store";

type ClinicResultsTableProps = {
  data: IClinicResultList[];
  columns: IColumns<IClinicResultList>;
  expandable?: ExpandableConfig<IClinicResultList> | undefined;
};

const ClinicResultsTable = ({
  data,
  columns,
  expandable,
}: ClinicResultsTableProps) => {
  const { clinicResultsStore, requestStore, generalStore } = useStore();
  const { lastViewedFrom } = requestStore;
  const { loadingStudies, getAll } = clinicResultsStore;
  const { generalFilter } = generalStore;
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

  const onExpand = (isExpanded: boolean, record: IClinicResultList) => {
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
    const defaultCode = !lastViewedFrom
      ? undefined
      : lastViewedFrom.from === "results"
      ? undefined
      : lastViewedFrom.code;
    getAll({
      ...generalFilter,
      buscar: defaultCode,
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
      <Table<IClinicResultList>
        loading={loadingStudies}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 500 }}
        expandable={{
          ...expandable,
          onExpand: onExpand,
          expandedRowKeys: expandedRowKeys,
        }}
        bordered
        rowClassName={"row-search"}
      />
    </Fragment>
  );
};

export default observer(ClinicResultsTable);
