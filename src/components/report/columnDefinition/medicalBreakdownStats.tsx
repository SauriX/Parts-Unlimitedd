import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
import { Descriptions } from "antd";

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
      {item.estudio.map((x) => {
        return (
          <>
            <Descriptions
              key={x.id}
              size="small"
              bordered
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ background: "#fff" }}
              style={{ marginBottom: 5 }}
            >
              {/* <Descriptions.Item label="Orden" style={{ maxWidth: 30 }}>
                {x.clave}
              </Descriptions.Item> */}
              <Descriptions.Item label="Clave" style={{ maxWidth: 30 }}>
                {x.clave}
              </Descriptions.Item>
              <Descriptions.Item
                label="Nombre del estudio"
                style={{ maxWidth: 30 }}
              >
                {x.estudio}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Compañia" style={{ maxWidth: 30 }}>
                {x.estatus}
              </Descriptions.Item> */}
              <Descriptions.Item label="Precio" style={{ maxWidth: 30 }}>
                {x.precio}
              </Descriptions.Item>
              <Descriptions.Item label="Precio Final" style={{ maxWidth: 30 }}>
                {x.precioFinal}
              </Descriptions.Item>
              <Descriptions.Item label="Total" style={{ maxWidth: 30 }}>
                {x.total}
              </Descriptions.Item>
            </Descriptions>
          </>
        );
      })}
    </div>
  ),
  rowExpandable: () => true,
};

export default getMedicalBreakdownStatsColumns;
