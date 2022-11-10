import { Button, Divider, PageHeader, Spin, Table, Form, Row, Col, Modal } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { formItemLayout } from "../../app/util/utils";
import { IBranchForm, IBranchInfo } from "../../app/models/branch";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import PasswordInput from "../../app/common/form/PasswordInput";
import HeaderTitle from "../../app/common/header/HeaderTitle";
type RoleTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const RoleTable: FC<RoleTableProps> = ({ componentRef, printing }) => {
  const branches: IBranchInfo[] = [
    {
      idSucursal: "string",
      clave: "string",
      nombre: "string",
      correo: "string",
      telefono: 123456789,
      codigoPostal: "17016",
      ubicacion: "ubicacion",
      clinico: "string",
      activo: true,
      ciudad:""
    },
  ];
  const { branchStore } = useStore();
  const { sucursales, getAll } = branchStore;
  let navigate = useNavigate();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  console.log("Table");
  useEffect(() => {
    const readUsers = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readUsers();
  }, [getAll, searchParams]);
  const columns: IColumns<IBranchInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 120,
      }),
      render: (value, role) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/branches/${role.idSucursal}?mode=ReadOnly&search=${searchParams.get("search") ?? "all"}`
            );
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: 150,
      }),
    },
    {
      ...getDefaultColumnProps("codigoPostal", "Código Postal", {
        searchState,
        setSearchState,
        width: 150,
      }),
    },
    {
      ...getDefaultColumnProps("ubicacion", "Localización", {
        searchState,
        setSearchState,
        width: 250,
      }),
    },
    {
      ...getDefaultColumnProps("clinico", "Clínicos", {
        searchState,
        setSearchState,
        width: 150,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: 100,
      fixed: "right",
      render: (value, rol) => (
        <IconButton
          title="Editar sucursal"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/branches/${rol.idSucursal}?search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];
  const TablePrint=() =>{
    return(
      <div ref={componentRef}>
      <PageHeader
      ghost={false} 
      title={<HeaderTitle title="Sucursales" image="laboratorio" />}
      className="header-container"
  ></PageHeader>
  <Divider className="header-divider" />
    <Table<IBranchInfo>
    loading={loading}
    size="small"
    dataSource={sucursales}
    rowKey={(record) => record.idSucursal}
    columns={columns.slice(0, 6)}
    pagination={false}
    />
  </div>
    );
  }
  return (
    <Fragment>
      <Table<IBranchInfo>
        loading={loading}
        size="small"
        rowKey={(record) => record.idSucursal}
        columns={columns}
        dataSource={sucursales}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: "max-content" }}
      />
      <div style={{ display: "none" }}>{< TablePrint  />}</div>
    </Fragment>
  );
};

export default RoleTable;
