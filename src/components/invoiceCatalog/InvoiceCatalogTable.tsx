import { Table, Tag, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../app/util/view";
import { IInvoiceList } from "../../app/models/invoiceCatalog";

const { Link, Text } = Typography;

const InvoiceCatalogTable = () => {
  const { invoiceCatalogStore, invoiceCompanyStore } = useStore();
  const { search, getAll, facturas, printTiket, printInvoice } =
    invoiceCatalogStore;
  const { printPdf ,downloadPdf} = invoiceCompanyStore;
  let navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readinvoice = async () => {
      setLoading(true);
      await getAll(search);
      setLoading(false);
    };

    readinvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAll]);

  const columns: IColumns<IInvoiceList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, item) => (
        <Link
          onClick={async () => {
            if (item.tipo === "REC") {
              await printTiket(item.expedienteId, item.solicitudId);
            } else {
  
                await printInvoice(item.id);

            }
          }}
        >
          {value == null ? "-" : `${item.serie}${value}`}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("tipo", "Tipo", {
        searchState,
        setSearchState,
        width: "5%",
      }),
    },
    {
      ...getDefaultColumnProps("descripcion", "Descripción", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },

    {
      ...getDefaultColumnProps("fechaCreacion", "Fecha creación", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, item) => (
        <Link
          onClick={() => {
            navigate(
              `/${views.request}/${item.expedienteId}/${item.solicitudId}`
            );
          }}
        >
          {`${value}`}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("compañia", "Compañia", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
  ];

  return (
    <Table<IInvoiceList>
      size="small"
      loading={loading}
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={[...facturas]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: "fit-content" }}
    />
  );
};

export default observer(InvoiceCatalogTable);
