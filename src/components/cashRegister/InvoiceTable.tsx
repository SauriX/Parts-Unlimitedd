import { Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useState } from "react";
import { ISearch } from "../../app/common/table/utils";
import { Invoice } from "../../app/models/cashRegister";
import getInvoiceColumns from "./tableDefinition/invoiceCashRegister";

type InvoiceProps = {
  data: Invoice;
  loading: boolean;
}

const InvoiceTable: FC<InvoiceProps> = ({data, loading}) => {
  const [searchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  return (
    <Fragment>
      <Table<Invoice>
        loading={loading}
        size="small"
        columns={getInvoiceColumns(searchState)}
        pagination={false}
        dataSource={[data]}
        scroll={{ x: 500, y: 400 }}
      />
    </Fragment>
  );
};

export default observer(InvoiceTable);
