import { DatePicker, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  IBranchService,
  IServicesCost,
  IServicesInvoice,
} from "../../../app/models/indicators";
import { moneyFormatter } from "../../../app/util/utils";
import { useStore } from "../../../app/stores/store";
import moment from "moment";

const CostosFijosColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { indicatorsStore, optionStore } = useStore();
  const { setServicesCost, servicesCost } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const onFinish = async (service: IServicesCost) => {
    const serviceExists = servicesCost.findIndex(
      (x) =>
        x.nombre === service.nombre && x.identificador === service.identificador
    );

    if (serviceExists > -1) {
      servicesCost[serviceExists] = service;
    } else {
      servicesCost.push(service);
    }
    setServicesCost(servicesCost);
  };

  const columns: IColumns<IServicesCost> = [
    {
      ...getDefaultColumnProps("costoFijo", "Costo Fijo", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (value: number, record: IServicesCost) => {
        return (
          <InputNumber
            min={0}
            defaultValue={value ?? 0}
            bordered={false}
            onChange={(costo) => {
              let findRecord = servicesCost.find(
                (x) => x.identificador === record.identificador
              );
              onFinish({ ...findRecord!, costoFijo: costo! });
            }}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("nombre", "Servicio", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursales", "Sucursal", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (value: IBranchService[], record) => {
        const selectedBranches = value?.map((x) => x.sucursalId);

        return (
          <Select
            defaultValue={selectedBranches}
            options={branchCityOptions}
            mode="multiple"
            bordered={false}
            onSelect={(value: string) => {
              let findRecord = servicesCost.findIndex(
                (x) => x.identificador === record.identificador
              );

              if (findRecord === -1) return;

              let branchServices = [
                ...(servicesCost[findRecord].sucursales ?? []),
              ];
              const getCity = branchCityOptions.find((x) =>
                x.options?.map((x) => x.value).includes(value)
              );

              branchServices.push({
                sucursalId: value,
                ciudad: getCity?.value as string,
              });

              onFinish({
                ...servicesCost[findRecord],
                sucursales: branchServices,
              });
            }}
            onDeselect={(value: string) => {
              let findRecord = servicesCost.findIndex(
                (x) => x.identificador === record.identificador
              );

              if (findRecord === -1) return;

              let branchServices = [
                ...(servicesCost[findRecord].sucursales ?? []),
              ];

              branchServices = branchServices.filter(
                (x) => x.sucursalId !== value
              );

              onFinish({
                ...servicesCost[findRecord],
                sucursales: branchServices,
              });
            }}
            style={{ width: "100%" }}
            allowClear
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha Alta", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (value: moment.Moment, record) => {
        const selectedDate =
          moment(value) ?? moment(Date.now()).utcOffset(0, true);

        return (
          <DatePicker
            bordered={false}
            defaultValue={selectedDate}
            picker="month"
            allowClear={false}
            onChange={(date) => {
              let findRecord = servicesCost.find(
                (x) => x.identificador === record.identificador
              );

              onFinish({
                ...findRecord!,
                fechaAlta: date!,
              });
            }}
          />
        );
      },
    },
  ];
  return columns;
};

export const CostosFijosInvoice = () => {
  const invoiceColumns: IColumns<IServicesInvoice> = [
    {
      ...getDefaultColumnProps("totalMensual", "Total Mensual", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalSemanal", "Total Semanal", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalDiario", "Total Diario", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return invoiceColumns;
};

export default CostosFijosColumns;
