import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Descriptions, Table, Typography } from "antd";
import { moneyFormatter } from "../../../app/util/utils";
import React from "react";
const { Text } = Typography;

const getCompanyStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "35%",
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
      ...getDefaultColumnProps("precioEstudios", "Estudios", {
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
      ...getDefaultColumnProps("totalEstudios", "Total", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export const expandableCompanyConfig = {
  expandedRowRender: (item: IReportData) => (
    <div>
      <h4>Estudios</h4>
      {item.estudio.map((x) => {
        return (
          <>
            <Descriptions
              size="small"
              bordered
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ background: "#fff" }}
              style={{ marginBottom: 5 }}
            >
              <Descriptions.Item label="Clave" style={{ maxWidth: 30 }}>
                {x.clave}
              </Descriptions.Item>
              <Descriptions.Item label="Estudio" style={{ maxWidth: 30 }}>
                {x.estudio}
              </Descriptions.Item>
              <Descriptions.Item label="Precio" style={{ maxWidth: 30 }}>
                ${x.precio}
              </Descriptions.Item>
            </Descriptions>
          </>
        );
      })}
    </div>
  ),
  rowExpandable: () => true,
};

// export const companyInvoice = (item: IReportData[]) => {
//   let totalEstudio = 0;
//   let totalDescuentos = 0;
//   item.forEach((x) => {
//     (totalEstudio += x.precioEstudios), (totalDescuentos += x.descuento);
//   });

//   return (
//     <React.Fragment>
//       <Table.Summary.Row>
//         <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
//         <Table.Summary.Cell index={1} colSpan={6}>
//           <Text type="danger">{totalEstudio}</Text>
//         </Table.Summary.Cell>
//         <Table.Summary.Cell index={2}>
//           <Text>{totalDescuentos}</Text>
//         </Table.Summary.Cell>
//       </Table.Summary.Row>
//       <Table.Summary.Row>
//         <Table.Summary.Cell index={0} colSpan={2}>
//           Balance
//         </Table.Summary.Cell>
//         <Table.Summary.Cell index={1} colSpan={5}>
//           <Text type="danger">{totalEstudio - totalDescuentos}</Text>
//         </Table.Summary.Cell>
//       </Table.Summary.Row>
//     </React.Fragment>
//   );
// };

export default getCompanyStatsColumns;
