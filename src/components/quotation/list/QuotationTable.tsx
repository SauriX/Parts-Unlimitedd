import { Table, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import { IQuotationInfo } from "../../../app/models/quotation";
import moment from "moment";

const { Link } = Typography;

const QuotationTable = () => {
  const { quotationStore } = useStore();
  const { loadingQuotations, quotations, getQuotations } = quotationStore;

  let navigate = useNavigate();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readQuotations = async () => {
      await getQuotations({
        fechaAInicial: moment().utcOffset(0, true),
        fechaAFinal: moment().utcOffset(0, true),
      });
    };

    readQuotations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IQuotationInfo> = [
    {
      ...getDefaultColumnProps("presupuesto", "Presupuesto", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, cotizacion) => (
        <Link
          onClick={() => {
            navigate(`/${views.quotatiion}/${cotizacion.cotizacionId}`);
          }}
        >
          {value}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("nomprePaciente", "Nombre del paciente", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("email", "Email", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("whatsapp", "Whatsapp", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
  ];

  return (
    <Table<IQuotationInfo>
      size="small"
      loading={loadingQuotations}
      rowKey={(record) => record.cotizacionId}
      columns={columns}
      dataSource={[...quotations]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: "fit-content" }}
    />
  );
};

export default observer(QuotationTable);
