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
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate,useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import PasswordInput from "../../app/common/form/PasswordInput";
/*const users: IUserInfo[] = [
  {
    id: "asd",
    clave: "MFarias",
    nombre: "Miguel Farias",
    tipoUsuario: "Admin",
    activo: true,
  },
];*/
type UserTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const UserTable:FC<UserTableProps> = ({ componentRef, printing }) => {
  const { userStore } = useStore();
  const { users, getAll,changePassword  } = userStore;
  let navigate = useNavigate();
  let id="";
  const { width: windowWidth } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formPassword] = Form.useForm<IChangePasswordForm>();
  const showModal = (ids:string) => {
    id=ids;
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formPassword.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinishPass=async(newValues:IChangePasswordForm)=>{
    let passForm ={... newValues};
    let success = false;
    let checkPass = false;
		success = await changePassword(passForm);
    console.log(success);
    if (success) {
      navigate(`/users`);
    }
  }
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
  const columns: IColumns<IUserInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/users/${user.idUsuario}?mode=ReadOnly&search=${searchParams.get("search") ?? "all"}`);
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
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("tipoUsuario", "Tipo de usuario", {
        searchState,
        setSearchState,
        width: "20%",
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
      key: "contraseña",
      dataIndex: "contraseña",
      title: "Contraseña",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value,user) => <IconButton title="Cambiar contraseña" onClick={()=>{showModal(user.idUsuario)}} icon={<LockOutlined />} />,
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value,user) => (
        <IconButton
          title="Editar usuario"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/users/${user.idUsuario}?search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];
  const UserTablePrint = () =>{
    return (
      <div ref={componentRef}>
      <Table<IUserInfo>
        loading={loading}
        size="small"
        rowKey={(record) => record.idUsuario}
        columns={columns}
        dataSource={[...users]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <Modal title="Ingreso de contraseña" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form<IChangePasswordForm>
            {...formItemLayout}
            form={formPassword}
            name="changepassword"
            onFinish={onFinishPass}
            scrollToFirstError
          >
            <Row>
              <Col md={24} sm={24} xs={24}>
                <PasswordInput
                  formProps={{
                    name: "password",
                    label: "Nueva Contraseña",
                  }}
                  max={8}
                  min={8}
                  required
              />
              </Col>
              <Col md={24} sm={24} xs={24}>
                  <PasswordInput
                    formProps={{
                      name: "confirmPassword",
                      label: "Confirmar Contraseña",
                    }}
                    max={8}
                    min={8}
                    required
                  />
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
      
    );
  }
  return(<Fragment>
                <Table<IUserInfo>
        loading={loading}
        size="small"
        rowKey={(record) => record.idUsuario}
        columns={columns}
        dataSource={[...users]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
          <div style={{ display: "none" }}>{<UserTablePrint />}</div>
      </Fragment>);
};

export default observer(UserTable);