import { Button, Divider, PageHeader, Table } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import views from "../../../app/util/view";
import { IPriceListEstudioList, IPriceListList } from "../../../app/models/priceList";

type PriceListTableProps = {
    data:IPriceListEstudioList[];
    closeModal: () => void
};

const StudyTable: FC<PriceListTableProps> = ({ data,closeModal }) => {
  const { priceListStore } = useStore();
  const { priceLists, getAll } = priceListStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IPriceListEstudioList> = [
    {
        ...getDefaultColumnProps("clave", "Clave", {
          searchState,
          setSearchState,
          width: "30%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  return (
    <Fragment>
      <Table<IPriceListEstudioList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...data]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(StudyTable);
