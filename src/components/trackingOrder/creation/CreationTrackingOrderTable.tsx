import { Table, Switch } from "antd";
import { FC, Fragment, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { useNavigate } from "react-router-dom";
import { IStudyTrackList as IStudyTrackList } from "../../../app/models/trackingOrder";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

type TrackingOrderTableProps = {
  id: string;
  printing: boolean;
};

const CreationTrackingOrderTable: FC<TrackingOrderTableProps> = ({
  id,
  printing,
}) => {
  const { trackingOrderStore } = useStore();
  const { trackingOrder } = trackingOrderStore;

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IStudyTrackList> = [
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
      ...getDefaultColumnProps("ruta", "Clave ruta", {
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
    },
    {
      ...getDefaultColumnProps("escaneo", "Escaneo", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, record) => {
        return (
          <Switch
            checked={value}
            onChange={(checked) => {
              record.escaneo = checked;
            }}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <Table<IStudyTrackList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[...trackingOrder]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(CreationTrackingOrderTable);
