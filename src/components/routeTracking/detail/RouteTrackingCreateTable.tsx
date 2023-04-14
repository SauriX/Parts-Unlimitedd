import { InputNumber, Popconfirm, Switch, Table } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ITagTrackingOrder } from "../../../app/models/routeTracking";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { studyStatus } from "../../../app/util/catalogs";
import { useStore } from "../../../app/stores/store";

const RouteTrackingCreateTable = () => {
  const { routeTrackingStore } = useStore();
  const {
    routeStudies,
    scan,
    setScan,
    tagsSelected,
    getStudyTrackingOrder,
    tagData,
  } = routeTrackingStore;
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const { width: windowWidth } = useWindowDimensions();
  const [checked, setChecked] = useState({ id: 0, checked: false });

  useEffect(() => {
    if (scan) {
      setChecked({ id: 0, checked: false });
    }
    if (tagData) {
      tagData.forEach((x) => {
        if (x.escaneo) {
          setChecked({ id: x.id, checked: true });
        }
      });
    }
  }, [scan, tagData]);

  const onChecked = (checked: boolean, record: ITagTrackingOrder) => {
    record.escaneo = checked;
    let study = getStudyTrackingOrder(record);
    let existingRecord = routeStudies.find((x) => x.id === study.id);

    if (checked && !existingRecord) {
      routeStudies.push(study);
    } else {
      routeStudies.splice(routeStudies.indexOf(study), 1);
    }

    setScan(false);
    setChecked({ id: record.id, checked: checked });

    return record;
  };

  const onCancel = (record: ITagTrackingOrder) => {
    record.escaneo = true;
  };

  const onConfirm = (record: ITagTrackingOrder) => {
    const index = tagData.findIndex((x) => x.id === record.id);
    let study = getStudyTrackingOrder(record);

    tagData.splice(index, 1);
    routeStudies.splice(routeStudies.indexOf(study), 1);
    tagsSelected.splice(tagsSelected.indexOf(record), 1);
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
      render: (value: number, record) => {
        return (
          <InputNumber
            min={1}
            max={100}
            bordered={false}
            defaultValue={value}
            onChange={(value) => {
              return (record.cantidad = value!);
            }}
          />
        );
      },
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
          <Fragment>
            {!record.extra ? (
              <Switch
                checked={checked.id === record.id ? checked.checked : value}
                onChange={(checked) => onChecked(checked, record)}
              />
            ) : (
              <Popconfirm
                title="Eliminar etiqueta"
                onConfirm={() => onConfirm(record)}
                onCancel={() => onCancel(record)}
                okText="Confirmar"
                cancelText="Cancelar"
              >
                <Switch
                  checked={checked.id === record.id ? checked.checked : value}
                />
              </Popconfirm>
            )}
          </Fragment>
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
        dataSource={[...tagData]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(RouteTrackingCreateTable);
