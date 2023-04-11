import { Switch, Table } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ITagTrackingOrder } from "../../../app/models/routeTracking";
import {
  IStudyTrackinOrder,
  ITagRouteList,
} from "../../../app/models/trackingOrder";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { studyStatus } from "../../../app/util/catalogs";
import { useStore } from "../../../app/stores/store";

type TrackingOrderTableProps = {
  id?: string;
  data: ITagTrackingOrder[];
};

const RouteTrackingCreateTable = ({ id, data }: TrackingOrderTableProps) => {
  const { routeTrackingStore } = useStore();
  const { routeStudies, scan, setScan } = routeTrackingStore;
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const { width: windowWidth } = useWindowDimensions();
  const [checked, setChecked] = useState({id: 0, checked: false});

  useEffect(() => {
    if (scan) {
      setChecked({id: 0, checked: false});
    }
  }, [scan]);

  const onChecked = (checked: boolean, record: ITagTrackingOrder) => {
    record.escaneo = checked;
    let study = getStudyTrackingOrder(record);

    if (record.escaneo) {
      routeStudies.push(study);
    } else {
      routeStudies.splice(routeStudies.indexOf(study), 1);
    }

    setScan(false);
    setChecked({id: record.id, checked: checked});

    return record;
  };

  const getStudyTrackingOrder = (record: ITagTrackingOrder) => {
    const studyTrackingOrder: IStudyTrackinOrder = {
      etiquetaId: record.id,
      solicitudId: record.solicitudId,
      claveEtiqueta: record.claveEtiqueta,
      claveRuta: record.claveRuta,
      cantidad: record.cantidad,
      estudios: record.estudios,
      solicitud: record.solicitud,
      recipiente: record.recipiente,
      estatus: record.estatus,
      escaneo: record.escaneo,
    };
    return studyTrackingOrder;
  };

  const columns: IColumns<ITagTrackingOrder> = [
    {
      ...getDefaultColumnProps("claveEtiqueta", "Clave muestra", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("recipiente", "Recipiente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("claveRuta", "Clave ruta", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value) => {
        return studyStatus(value);
      },
    },
    {
      ...getDefaultColumnProps("escaneo", "Escaneo", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value: boolean, record) => {
        return (
          <Switch
            checked={checked.id === record.id ? checked.checked : value}
            onChange={(checked) => onChecked(checked, record)}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <Table<ITagTrackingOrder>
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[...data]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(RouteTrackingCreateTable);
