import { Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useState } from "react";
import { ISearch } from "../../app/common/table/utils";
import { ICommonData } from "../../app/models/cashRegister";
import getCashRegisterColumns from "./tableDefinition/cashRegister";

type CashRegisterProps = {
  data: ICommonData[];
  loading: boolean;
}

const CashTable: FC<CashRegisterProps> = ({data, loading}) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  return (
    <Fragment>
      <Table<ICommonData>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={getCashRegisterColumns(searchState, setSearchState)}
        pagination={false}
        dataSource={[...data]}
        scroll={{ x: "max-content" }}
        rowClassName={(item) =>
          item.factura == "Total" ? "Resumen Total" : ""
        }
      />
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Tag color="lime">{Math.max(data.length - 1, 0)} Registros</Tag>
      </div>
    </Fragment>
  );
};

export default observer(CashTable);
