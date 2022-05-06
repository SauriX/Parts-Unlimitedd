import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { IUserPermission, IUserForm, UserFormValues, IClave, claveValues } from "../../../app/models/user";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { convertToTreeData, onTreeSearch, onTreeSelectChange } from "./utils";
import { TreeData } from "../../../app/models/shared";
import { DataNode } from "antd/lib/tree";
import PasswordInput from "../../../app/common/form/PasswordInput";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import IconButton from "../../../app/common/button/IconButton";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import { useStore } from "../../../app/stores/store";
import ImageButton from "../../../app/common/button/ImageButton";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { observer } from "mobx-react-lite";
type UserFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};
type UrlParams = {
  id: string;
};

const UserForm: FC<UserFormProps> = ({ componentRef, load }) => {
  const { userStore, roleStore, optionStore } = useStore();
  const { roleOptions, getRoleOptions } = optionStore;
  const { getPermissionById } = roleStore;
  const { getById, create, update, Clave, generatePass, changePassordF, getAll, users, getPermission } =
    userStore;
  const [form] = Form.useForm<IUserForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [permissionsAdded, setPermissionsAdded] = useState<TreeData[]>([]);
  const [permissionsAvailable, setPermissionsAvailable] = useState<TreeData[]>([]);

  const [permissionsAddedFiltered, setPermissionsAddedFiltered] = useState<TreeData[]>([]);
  const [permissionsAvailableFiltered, setPermissionsAvailableFiltered] = useState<TreeData[]>([]);
  let navigate = useNavigate();

  const [values, setValues] = useState<IUserForm>(new UserFormValues());

  const [searchParams, setSearchParams] = useSearchParams();
  let { id } = useParams<UrlParams>();
  let user: IUserForm = new UserFormValues();
  let clave: IClave = new claveValues();

  useEffect(() => {
    getRoleOptions();
  }, [getRoleOptions]);

  useEffect(() => {
    setTargetKeys(values.permisos?.filter((x) => x.asignado).map((x) => x.id.toString()) ?? []);
  }, []);

  useEffect(() => {
    const readuser = async (idUser: string) => {
      setLoading(true);
      const user = await getById(idUser);

      form.setFieldsValue(user!);

      setValues(user!);
      setLoading(false);
    };
    const newpass = async () => {
      let pass = await generatePass();
      form.setFieldsValue({ confirmaContraseña: pass, contraseña: pass });
    };
    const permission = async () => {
      const permissions = await getPermission();
      setValues({ ...values, permisos: permissions });
    };
    if (id) {
      readuser(id);
    } else {
      newpass();
      permission();
    }
  }, [form, getById, id]);

  const transform = useMemo(
    () =>
      convertToTreeData(
        targetKeys,
        setPermissionsAdded,
        setPermissionsAvailable,
        setPermissionsAddedFiltered,
        setPermissionsAvailableFiltered
      ),
    [targetKeys]
  );

  /*   useEffect(() => {
      transform(values?.permisos ?? []);
    }, [values?.permisos, targetKeys, transform]); */
  useEffect(() => {
    if (values.permisos && values.permisos.length > 0) {
      setTargetKeys(values.permisos.filter((x) => x.asignado).map((x) => x.id.toString()));
    }
  }, [values.permisos]);

  useEffect(() => {
    transform(values.permisos ?? []);
  }, [values.permisos, targetKeys, transform]);

  const onSearch = onTreeSearch(
    setPermissionsAvailableFiltered,
    permissionsAvailable,
    setPermissionsAddedFiltered,
    permissionsAdded
  );

  useEffect(() => {
    const readUsers = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readUsers();
  }, [getAll, searchParams]);

  const filterOption = (inputValue: string, option: IUserPermission) => {
    return (
      option.menu.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
      option.permiso.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  };
  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys.sort((a, b) => a.length - b.length));
  };

  const onSelectChange = onTreeSelectChange(
    permissionsAvailableFiltered,
    permissionsAddedFiltered,
    user,
    targetKeys,
    setSelectedKeys
  );
  const onValuesChange = async (changeValues: any) => {
    const fields = Object.keys(changeValues)[0];

    if (fields === "nombre") {
      const value = changeValues[fields];
      clave.nombre = value;
      if (id) {
        clave.primerApellido = values.primerApellido;
        clave.segundoApellido = values.segundoApellido;
      }
    }
    if (fields === "primerApellido") {
      const value = changeValues[fields];
      clave.primerApellido = value;
      if (id) {
        console.log("mi loco entre");
        clave.nombre = values.nombre;
        clave.segundoApellido = values.segundoApellido;
      }
    }
    if (fields === "segundoApellido") {
      const value = changeValues[fields];
      clave.segundoApellido = value;
      if (id) {
        clave.nombre = values.nombre;
        clave.primerApellido = values.primerApellido;
      }
    }
    if (fields === "rolId") {
      const value = changeValues[fields];
      const permissions = await getPermissionById(value);
      setValues({ ...values, permisos: permissions });
    }
    newclave();
  };
  const newclave = async () => {
    if (clave.nombre != "" && clave.primerApellido != "" && clave.segundoApellido != "") {
      let newclave = await Clave(clave);
      form.setFieldsValue({ clave: newclave.toString() });
    }
  };
  const onFinish = async (newValues: IUserForm) => {
    setLoading(true);
    const User = { ...values, ...newValues };
    const permissions = values.permisos?.map((x) => ({
      ...x,
      asignado: targetKeys.includes(x.id.toString()),
    }));
    User.permisos = permissions;
    if (!User.permisos || User.permisos.filter((x) => x.asignado).length === 0) {
      alerts.warning(messages.emptyPermissions);

      return;
    }
    let success = false;
    if (!User.id) {
      success = await create(User);
    } else {
      success = await update(User);
    }
    setLoading(false);

    if (success) {
      navigate(`/users?search=${searchParams.get("search") || "all"}`);
    }
  };

  const onDeselectParent = (key: string | number, children: DataNode[]) => {
    setSelectedKeys(selectedKeys.filter((x) => !children.map((y) => y.key).includes(x)));
  };

  const onSelectParent = (key: string | number, children: DataNode[]) => {
    setSelectedKeys([...selectedKeys, ...children.map((y) => y.key.toString())]);
  };

  const actualUser = () => {
    if (id) {
      const index = users.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };
  const siguienteUser = (index: number) => {
    console.log(id);
    const user = users[index];

    navigate(
      `/users/${user?.id}?mode=${searchParams.get("mode")}&search=${searchParams.get("search") ?? "all"}`
    );
  };
  return (
    <Spin spinning={loading || load}>
      <div ref={componentRef}>
        <Row style={{ marginBottom: 24 }}>
          {id && (
            <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
              <Pagination
                size="small"
                total={users.length}
                pageSize={1}
                current={actualUser()}
                onChange={(value) => {
                  siguienteUser(value - 1);
                }}
              />
            </Col>
          )}
          {!CheckReadOnly() && (
            <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
              <Button
                onClick={() => {
                  navigate(`/users`);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  form.submit();
                }}
              >
                Guardar
              </Button>
            </Col>
          )}
          {CheckReadOnly() && (
            <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={() => {
                  navigate(`/users/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`);
                }}
              />
            </Col>
          )}
        </Row>
        <Form<IUserForm>
          {...formItemLayout}
          form={form}
          name="user"
          initialValues={values}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          scrollToFirstError
          onFieldsChange={() => {
            setDisabled(
              !form.isFieldsTouched() ||
                form.getFieldsError().filter(({ errors }) => errors.length).length > 0
            );
          }}
        >
          <Row>
            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "clave",
                  label: "Clave",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <PasswordInput
                formProps={{
                  name: "contraseña",
                  label: "Contraseña",
                }}
                max={8}
                min={8}
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "nombre",
                  label: "Nombre",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            </Col>

            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "primerApellido",
                  label: "Primer Apellido",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <SwitchInput
                name="activo"
                label="Activo"
                onChange={(value) => {
                  if (value) {
                    alerts.info(messages.confirmations.enable);
                  } else {
                    alerts.info(messages.confirmations.disable);
                  }
                }}
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "segundoApellido",
                  label: "Segundo Apellido",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <SelectInput
                formProps={{ name: "sucursalId", label: "Sucursal" }}
                options={[{ value: "0", label: "test" }]}
                readonly={CheckReadOnly()}
                required
              />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <SelectInput
                formProps={{ name: "rolId", label: "Tipo de usuario" }}
                required
                options={roleOptions}
                readonly={CheckReadOnly()}
              />
            </Col>
          </Row>
        </Form>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Tag color="blue" style={{ fontSize: 14 }}>
            Usuario: {values.nombre} {values.primerApellido}
          </Tag>
        </Row>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ width: "fit-content", margin: "auto" }}>
            <Transfer<IUserPermission>
              dataSource={values.permisos}
              showSearch
              onSearch={onSearch}
              onChange={onChange}
              style={{ justifyContent: "flex-end" }}
              listStyle={{
                width: 300,
                height: 300,
              }}
              rowKey={(x) => x.id.toString()}
              titles={[
                <Tooltip title="Permisos que pueden ser asignados">Disponibles</Tooltip>,
                <Tooltip title="Permisos asignados al tipo de usuario">Agregados</Tooltip>,
              ]}
              filterOption={filterOption}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onSelectChange={(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
                onSelectChange(sourceSelectedKeys, targetSelectedKeys);
                setDisabled(false);
              }}
              disabled={CheckReadOnly()}
            >
              {({ direction, onItemSelect, selectedKeys, filteredItems }) => {
                const data = direction === "left" ? permissionsAvailableFiltered : permissionsAddedFiltered;
                const checkedKeys = [...selectedKeys];
                return (
                  <Tree
                    checkable={!CheckReadOnly()}
                    disabled={CheckReadOnly()}
                    height={200}
                    onCheck={(_, { node: { key, children, checked } }) => {
                      if (children && children.length > 0 && checked) {
                        onDeselectParent(key, children);
                      } else if (children && children.length > 0) {
                        onSelectParent(key, children);
                      } else {
                        onItemSelect(key.toString(), !checked);
                      }
                      setDisabled(false);
                    }}
                    onSelect={(_, { node: { key, checked, children } }) => {
                      if (children && children.length > 0 && checked) {
                        onDeselectParent(key, children);
                      } else if (children && children.length > 0) {
                        onSelectParent(key, children);
                      } else {
                        onItemSelect(key.toString(), !checked);
                      }
                      setDisabled(false);
                    }}
                    treeData={data}
                    showIcon
                    checkedKeys={checkedKeys}
                  />
                );
              }}
            </Transfer>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default observer(UserForm);
