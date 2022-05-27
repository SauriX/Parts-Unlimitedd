import { Button, Divider, PageHeader,Popover,  Table } from "antd";
import React, { FC, Fragment, useEffect,  useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ILoyaltyList } from "../../app/models/loyalty";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DateRangeInput from "../../app/common/form/DateRangeInput";

type LoyaltyTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const LoyaltyTable: FC<LoyaltyTableProps> = ({ componentRef, printing }) => {
  const { loyaltyStore } = useStore();
  const { loyaltys, getAll } = loyaltyStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  const Reagendar = (
    <div>
      <DateRangeInput
        formProps={{ label: "Descuento entre", name: "fecha" }}
      />
    </div>
  );

  useEffect(() => {
    const readLoyalty = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readLoyalty();
  }, [getAll, searchParams]);

  const columns: IColumns<ILoyaltyList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "6%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, loyaltys) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/loyalties/${loyaltys.id}?${searchParams}&mode=readonly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("cantidadDescuento", "Beneficio Aplicado", {
        searchState,
        setSearchState,
        width: "9%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    } ,
    {
      ...getDefaultColumnProps("fecha", "Fecha de Vigencia", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("tipoDescuento", "Promocion", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Reagendar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (
        <Popover content={Reagendar} title="Title">
          <Button type="primary">Reagendar</Button>
        </Popover>
      ),
    },
    
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (
        <IconButton
          title="Editar Lealtad"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/loyalties/${value}?${searchParams}&mode=edit&search=${searchParams.get("search") ?? "all"}`
            );
          }}
        />
      ),
    },
  ];

  const LoyaltyTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Lealtades" image="Lealtad" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<ILoyaltyList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 8)}
          pagination={false}
          dataSource={[...loyaltys]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<ILoyaltyList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...loyaltys]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<LoyaltyTablePrint />}</div>
    </Fragment>
  );
};

export default observer(LoyaltyTable);