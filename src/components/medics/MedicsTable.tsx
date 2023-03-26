import { Button, Divider, PageHeader, Table } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
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
import { IMedicsList } from "../../app/models/medics";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";

type MedicsTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const MedicsTable: FC<MedicsTableProps> = ({ componentRef, printing }) => {
  const { medicsStore } = useStore();
  const { medics, getAll } = medicsStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readMedics = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readMedics();
  }, [getAll, searchParams]);

  const columns: IColumns<IMedicsList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, medics) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/medics/${
                medics.idMedico
              }?${searchParams}&mode=readonly&search=${
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
      ...getDefaultColumnProps("nombreCompleto", "Nombre", {
        searchState,
        setSearchState,
        width: "12%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("direccion", "Dirección", {
        searchState,
        setSearchState,
        width: "16%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    } /*
    {
      ...getDefaultColumnProps("clinica", "Clinica", {
        searchState,
        setSearchState,
        width: "2%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },*/,
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("celular", "Celular", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    } /*
    {
      ...getDefaultColumnProps( "observaciones", "Observaciones", {
        searchState,
        setSearchState,
        width: "12%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },*/,
    {
      ...getDefaultColumnProps("especialidad", "Especialidad", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    // {
    //   ...getDefaultColumnProps( "ActivoDescripcion", "Activo", {
    //     searchState,
    //     setSearchState,
    //     width: "8%",
    //     minWidth: 150,
    //     windowSize: windowWidth,

    //   }),
    // },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "idMedico",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (
        <IconButton
          title="Editar Médico"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/medics/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
  ];

  const MedicsTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IMedicsList>
          size="large"
          rowKey={(record) => record.idMedico}
          columns={columns.slice(0, 8)}
          pagination={false}
          dataSource={[...medics]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IMedicsList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.idMedico}
        columns={columns}
        dataSource={[...medics]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<MedicsTablePrint />}</div>
    </Fragment>
  );
};

export default observer(MedicsTable);
