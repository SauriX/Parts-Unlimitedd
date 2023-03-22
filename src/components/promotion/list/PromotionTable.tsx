import { Divider, PageHeader, Table, Typography } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import views from "../../../app/util/view";
import { IPromotionList } from "../../../app/models/promotion";

const { Link } = Typography;

type PromotionTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const PromotionTable: FC<PromotionTableProps> = ({
  componentRef,
  printing,
}) => {
  const { promotionStore } = useStore();
  const { getAll, promotions } = promotionStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readPromotions = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    if (promotions.length === 0) {
      readPromotions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IPromotionList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value, promotion) => (
        <Link
          onClick={() => {
            navigate(
              `/${views.promo}/${promotion.id}?${searchParams}&mode=readonly`
            );
          }}
        >
          {value}
        </Link>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("periodo", "Periodo", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("listaPrecio", "Lista de precio", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (value) => (
        <IconButton
          title="Editar promoción"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.promo}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const ReagentTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle
              title="Catálogo de Promociones en listas de precios"
              image="promocion"
            />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IPromotionList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 4)}
          pagination={false}
          dataSource={[...promotions]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IPromotionList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...promotions]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: "auto" }}
      />
      <div style={{ display: "none" }}>{<ReagentTablePrint />}</div>
    </Fragment>
  );
};

export default observer(PromotionTable);
