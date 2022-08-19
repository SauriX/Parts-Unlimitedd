import { IColumns, ISearch } from "../../../app/common/table/utils";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
import React from "react";
import { ICommonData } from "../../../app/models/cashRegister";

const getCashRegisterColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<ICommonData> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "35%",
      }),
      fixed: 'left',
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: "60%",
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total a pagar", {
        width: "40%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("factura", "Factura", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("aCuenta", "A Cuenta", {
        searchState,
        setSearchState,
        width: "40%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("efectivo", "Efectivo", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("tdc", "TDC", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("transferencia", "Transf. E", {
        width: "40%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("cheque", "Cheque", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("tdd", "TDD", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("pp", "PP", {
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("totalRecibido", "Total Recibido", {
        width: "40%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("saldo", "Saldo", {
        width: "30%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("fecha", "Hora", {
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("usuarioModifico", "Usuario", {
        width: "60%",
      }),
    },
    {
      ...getDefaultColumnProps("empresa", "Compañía", {
        width: "30%",
      }),
      fixed: 'right',
    },
  ];

  return columns;
};

export default getCashRegisterColumns;
