import { Button, Divider, PageHeader, Spin, Table, Form, Row, Col, Modal } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { formItemLayout } from "../../app/util/utils";
import { IUserList, IChangePasswordForm } from "../../app/models/user";
import { IRole } from "../../app/models/role";
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
  const { roleStore } = useStore();
  const { roles, getAll } = roleStore;
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
  const columns: IColumns<IRole> = [
    {
      ...getDefaultColumnProps("nombre", "Rol de usuario", {
        searchState,
        setSearchState,
        width: "80%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, role) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/roles/${role.id}?mode=ReadOnly&search=${searchParams.get("search") ?? "all"}`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("activo", "Activo", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 80,
        windowSize: windowWidth,
      }),
      align: "center",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 80 : "10%",
      render: (value, rol) => (
        <IconButton
          title="Editar Rol"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/roles/${rol.id}?search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];

  const RoleTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo Roles" image="rol" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IRole>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 2)}
          dataSource={[...roles]}
          pagination={false}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IRole>
        loading={loading ||printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...roles]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<RoleTablePrint />}</div>
    </Fragment>
  );
};

export default RoleTable;
