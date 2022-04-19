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
      codigoPostal:"17016",
      ubicacion: "ubicacion",
      clinico: "string",
      activo: true,
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
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, role) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/sucursales/${role.idSucursal}?mode=ReadOnly&search=${searchParams.get("search") ?? "all"}`);
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
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Telefono", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("codigoPostal", "Codigo Postal", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("ubicacion", "Localizacion", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    
    {
      ...getDefaultColumnProps("clinico", "Clinicos", {
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
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, rol) => (
        <IconButton
          title="Editar usuario"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/sucursales/${rol.idSucursal}?search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];

  return (
    <div ref={componentRef}>
      <Table<IBranchInfo>
        loading={loading}
        size="small"
        rowKey={(record) => record.idSucursal}
        columns={columns}
        dataSource={sucursales}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </div>
  );
};

export default RoleTable;