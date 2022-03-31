import { Button, Divider, PageHeader, Spin, Table } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
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
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import Search from "antd/es/transfer/search";

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

  console.log("Table");

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
        width: "5%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/medics/${user.idMedico}`);
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
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("direccion", "Direccion", {
        searchState,
        setSearchState,
        width: "18%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Telefono", {
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
    },
    {
      ...getDefaultColumnProps( "observaciones", "Observaciones", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps( "especialidadId", "Especialidad", {
        searchState,
        setSearchState,
        width: "10%",
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
      dataIndex: "idMedico",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "5%",
      render: (value) => (
        <IconButton
          title="Editar Medico"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/medics/${value}`);
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
          title={<HeaderTitle title="Catálogo de Medicos" image="reagent" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IMedicsList>
          size="large"
          rowKey={(record) => record.idMedico}
          columns={columns.slice(0, 9)}
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