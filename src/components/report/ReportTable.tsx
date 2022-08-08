import { Descriptions, Table, Tag, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { IReportData } from "../../app/models/report";
import { ExpandableConfig } from "antd/lib/table/interface";
import { useParams, useSearchParams } from "react-router-dom";
const { Text } = Typography;

type ReportTableProps = {
  loading: boolean;
  data: IReportData[];
  columns: IColumns<IReportData>;
  hasFooterRow?: boolean;
  expandable?: ExpandableConfig<IReportData> | undefined;
  summary?: boolean;
};

type ReportName = {
  report: string;
}

let totalEstudios = 0;
let totalDescuentos = 0;
let total = 0;
let IVA = total * 0.16;
let subtotal = total - IVA;
let auxTotalDescuentosPorcentual = 0;
let totalDescuentosPorcentual = 0;

const ReportTable = ({
  loading,
  data,
  columns,
  hasFooterRow,
  expandable,
  summary,
}: ReportTableProps) => {
  const [report, setReport] = useState<string>()
  const [params] = useSearchParams()

  useEffect(() => {
    setReport(params.get("report") ?? undefined)
  }, [params.get("report")])

  console.log(report)
  totalDescuentos = 0;
  totalEstudios = 0;
  {
    data.forEach((x) => {
      totalEstudios += x.precioEstudios;
      report == "cargo" ? totalDescuentos += x.cargo : totalDescuentos += x.descuento
    });
  }
  auxTotalDescuentosPorcentual = (totalDescuentos / totalEstudios) * 100;
  totalDescuentosPorcentual = Math.round(auxTotalDescuentosPorcentual * 100) / 100
  report == "cargo" ? total = totalEstudios + totalDescuentos : total = totalEstudios - totalDescuentos
  IVA = total * 0.16;
  subtotal = total - IVA;
  return (
    <Fragment>
      <Table<IReportData>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 500 }}
        rowClassName={(item) =>
          item.claveMedico == "Total" || item.paciente === "Total"
            ? "Resumen Total"
            : ""
        }
        expandable={expandable}
      />
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Tag color="lime">
          {!hasFooterRow ? data.length : Math.max(data.length - 1, 0)} Registros
        </Tag>
      </div>
      {summary ? (
        <>
          <Descriptions
            title="Desglose Final"
            size="small"
            bordered
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ background: "#fff" }}
            style={{ marginBottom: 5 }}
          >
            <Descriptions.Item label="Estudios" style={{ maxWidth: 30 }}>
              ${totalEstudios == 0 ? 0 : totalEstudios}
            </Descriptions.Item>
            <Descriptions.Item label={report == "cargo" ? "Cargo %" : "Desc. %"} style={{ maxWidth: 30 }}>
              {isNaN(totalDescuentosPorcentual) ? 0 : totalDescuentosPorcentual}%
            </Descriptions.Item>
            <Descriptions.Item label={report == "cargo" ? "Cargo" : "Desc."} style={{ maxWidth: 30 }}>
              ${totalDescuentos}
            </Descriptions.Item>
            <Descriptions.Item label="Subtotal" style={{ maxWidth: 30 }}>
              ${Math.round(subtotal * 100) / 100}
            </Descriptions.Item>
            <Descriptions.Item label="IVA" style={{ maxWidth: 30 }}>
              ${Math.round(IVA * 100) / 100}
            </Descriptions.Item>
            <Descriptions.Item label="Total" style={{ maxWidth: 30 }}>
              ${total}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default observer(ReportTable);
