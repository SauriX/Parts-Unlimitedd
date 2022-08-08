import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
import { Descriptions } from "antd";

import { v4 as uuid } from "uuid";

const getMedicalBreakdownStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("claveMedico", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("medico", "Nombre del Médico", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("empresa", "Compañia", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("descuentoPorcentual", "Desc. %", {
        width: "20%",
      }),
      render: (value) => Math.round(value * 100) / 100 + "%",
    },
    {
      ...getDefaultColumnProps("descuento", "Desc.", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("iva", "IVA", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalEstudios", "Total", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    // {
    //   ...getDefaultColumnProps("noPacientes", "No. Pacientes", {
    //     searchState,
    //     setSearchState,
    //     width: "20%",
    //   }),
    // },
  ];

  return columns;
};
export const expandableMedicalBreakdownConfig = {
  expandedRowRender: (item: IReportData) => (
    <div>
      <h4>Estudios</h4>
      {item.estudio.map((x, i) => {
        return (
          <>
            <Descriptions
              key={uuid()}
              size="small"
              bordered
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ background: "#fff" }}
              style={{ marginBottom: 5 }}
            >
              {/* <Descriptions.Item label="Orden" style={{ maxWidth: 30 }}>
                {x.clave}
              </Descriptions.Item> */}
              <Descriptions.Item
                key={uuid()}
                label="Clave"
                style={{ maxWidth: 30 }}
              >
                {x.clave}
              </Descriptions.Item>
              <Descriptions.Item
                key={uuid()}
                label="Nombre del estudio"
                style={{ maxWidth: 30 }}
              >
                {x.estudio}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Compañia" style={{ maxWidth: 30 }}>
                {x.estatus}
              </Descriptions.Item> */}
              <Descriptions.Item
                key={uuid()}
                label="Precio"
                style={{ maxWidth: 30 }}
              >
                {x.precio}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Precio Final" style={{ maxWidth: 30 }}>
                {x.precioFinal}
              </Descriptions.Item>
              <Descriptions.Item label="Total" style={{ maxWidth: 30 }}>
                {x.total}
              </Descriptions.Item> */}
            </Descriptions>
          </>
        );
      })}
    </div>
  ),
  rowExpandable: () => true,
};

export default getMedicalBreakdownStatsColumns;
