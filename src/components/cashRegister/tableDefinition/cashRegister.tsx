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
        width: 200,
      }),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: 250,
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total a pagar", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("factura", "Factura", {
        searchState,
        setSearchState,
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("aCuenta", "A Cuenta", {
        searchState,
        setSearchState,
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("efectivo", "Efectivo", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("tdc", "TDC", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("transferencia", "Transf. E", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("cheque", "Cheque", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("tdd", "TDD", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("pp", "PP", {
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("totalRecibido", "Total Recibido", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("saldo", "Saldo", {
        width: 200,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("fecha", "Hora", {
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("usuarioRegistra", "Usuario", {
        width: 200,
      }),
    },
    {
      ...getDefaultColumnProps("empresa", "Compañía", {
        width: 200,
      }),
      fixed: "right",
    },
  ];

  return columns;
};

export default getCashRegisterColumns;
