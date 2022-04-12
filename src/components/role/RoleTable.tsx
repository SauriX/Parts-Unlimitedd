
import { Button, Divider, PageHeader, Spin, Table,Form, Row, Col,  Modal,  } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { formItemLayout } from "../../app/util/utils";
import { IUserInfo,IChangePasswordForm } from "../../app/models/user";
import {IRole} from "../../app/models/role";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate,useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import PasswordInput from "../../app/common/form/PasswordInput";
type RoleTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const RoleTable:FC<RoleTableProps> = ({ componentRef, printing })=> {
  const { roleStore } = useStore();
  const { roles, getAll  } = roleStore;
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
        width: "15%",
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
      render: (value,rol) => (
        <IconButton
          title="Editar usuario"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/roles/${rol.id}?search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];

  return (<div ref={componentRef}>
    <Table<IRole>
      loading={loading}
      size="small"
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={[...roles]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
    </div>
);
};

export default RoleTable;