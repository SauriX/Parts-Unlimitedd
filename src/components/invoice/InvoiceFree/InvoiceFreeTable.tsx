import { Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";

const { Link, Text } = Typography;

const InvoiceFreeTable = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<any> = [
    {
      ...getDefaultColumnProps("documento", "Documento", {
        searchState,
        setSearchState,
        width: 25,
      }),
      render: (_, fullRow) => {
        return (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Link
                onClick={() => {
                  navigate(`/invoice/${fullRow.tipo}/${fullRow.facturapiId}`);
                }}
              >
                {fullRow?.documento}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      ...getDefaultColumnProps("cliente", "Cliente", {
        searchState,
        setSearchState,
        width: 25,
      }),
    },
    {
      ...getDefaultColumnProps("fechaCreacion", "Fecha Creación", {
        searchState,
        setSearchState,
        width: 25,
      }),
    },
    {
      ...getDefaultColumnProps("monto", "Monto", {
        searchState,
        setSearchState,
        width: 25,
      }),
      render: (value) => `${moneyFormatter.format(value)} (IVA Incluido)`,
    },
  ];
  const { invoiceCompanyStore } = useStore();
  const { isLoading, invoicesFree } = invoiceCompanyStore;
  return (
    <>
      <Table
        bordered
        columns={columns}
        rowClassName={"row-search"}
        className="header-expandable-table"
        pagination={false}
        loading={isLoading}
        dataSource={invoicesFree}
      ></Table>
    </>
  );
};

export default observer(InvoiceFreeTable);
