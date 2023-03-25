import { Table, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
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
import {
  IQuotationInfo,
  IQuotationStudyInfo,
} from "../../../app/models/quotation";

const { Link, Text } = Typography;

const QuotationTable = () => {
  const { quotationStore } = useStore();
  const { loadingQuotations, quotations } = quotationStore;

  let navigate = useNavigate();

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IQuotationInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, cotizacion) => (
        <Link
          onClick={() => {
            navigate(`/${views.quotation}/${cotizacion.cotizacionId}`);
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
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "35%",
      }),
      render: (value: IQuotationStudyInfo[]) =>
        value.map((x) => (
          <Tooltip key={x.id} title={x.nombre}>
            <Tag>{x.clave}</Tag>
          </Tooltip>
        )),
    },
    {
      ...getDefaultColumnProps("contacto", "Contacto", {
        searchState,
        setSearchState,
        width: "12%",
      }),
      className: "no-padding-cell",
      render: (_, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>{item.correo?.split(",")?.join("\n")}</Text>
          <small>
            <Text type="secondary">{item.whatsapp}</Text>
          </small>
        </div>
      ),
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
      width: "8%",
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
