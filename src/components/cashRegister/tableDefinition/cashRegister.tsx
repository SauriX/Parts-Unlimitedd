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
        width: 100,
      }),
      fixed: 'left',
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total a pagar", {
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("factura", "Factura", {
        searchState,
        setSearchState,
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("aCuenta", "A Cuenta", {
        searchState,
        setSearchState,
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("formaPago", "Método de pago", {
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("pp", "PP", {
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("totalRecibido", "Total Recibido", {
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("saldo", "Saldo", {
        width: 100,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("fecha", "Hora", {
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("usuarioModifico", "Usuario", {
        width: 100,
      }),
    },
    {
      ...getDefaultColumnProps("empresa", "Compañía", {
        width: 100,
      }),
      fixed: 'right',
    },
  ];

  return columns;
};

export default getCashRegisterColumns;
