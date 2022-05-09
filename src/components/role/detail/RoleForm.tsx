import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { IUserPermission } from "../../../app/models/user";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { convertToTreeData, onTreeSearch, onTreeSelectChange } from "./utils";
import { TreeData } from "../../../app/models/shared";
import { DataNode } from "antd/lib/tree";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import ImageButton from "../../../app/common/button/ImageButton";
import { IRoleForm, RoleFormValues, IRolePermission } from "../../../app/models/role";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";

type UserFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};

type UrlParams = {
  id: string;
};

const RoleForm: FC<UserFormProps> = ({ componentRef, load }) => {
  const { roleStore } = useStore();
  const { getPermission, create, getById, getAll, roles, update } = roleStore;
  const [form] = Form.useForm<IRoleForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [permissionsAdded, setPermissionsAdded] = useState<TreeData[]>([]);
  const [permissionsAvailable, setPermissionsAvailable] = useState<TreeData[]>([]);

  const [permissionsAddedFiltered, setPermissionsAddedFiltered] = useState<TreeData[]>([]);
  const [permissionsAvailableFiltered, setPermissionsAvailableFiltered] = useState<TreeData[]>([]);
  let navigate = useNavigate();

  const [values, setValues] = useState<IRoleForm>(new RoleFormValues());

  const [searchParams, setSearchParams] = useSearchParams();
  let { id } = useParams<UrlParams>();
  let role: IRoleForm = new RoleFormValues();

  useEffect(() => {
    setTargetKeys(values.permisos?.filter((x) => x.asignado).map((x) => x.id.toString()) ?? []);
  }, []);

  useEffect(() => {
    const readRole = async (idUser: string) => {
      setLoading(true);
      const user = await getById(idUser);
      form.setFieldsValue(user!);

      setValues(user!);
      setLoading(false);
    };

    const readPermission = async () => {
      const permissions = await getPermission();
      setValues({ ...values, permisos: permissions });
    };
    if (id) {
      readRole(id);
    } else {
      readPermission();
    }
  }, [form, getById, getPermission, id]);
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
    }, [values?.permisos, targetKeys, transform]);
   */
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
      console.log("soy el use efect");
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      console.log("roles");
      console.log(roles);
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
    role,
    targetKeys,
    setSelectedKeys
  );

  const onFinish = async (newValues: IRoleForm) => {
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
      navigate(`/roles?search=${searchParams.get("search") || "all"}`);
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
      const index = roles.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };
  const siguienteUser = (index: number) => {
    const user = roles[index];

    navigate(
      `/roles/${user?.id}?mode=${searchParams.get("mode")}&search=${searchParams.get("search") ?? "all"}`
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
                total={roles.length}
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
                  navigate(`/roles`);
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
                  navigate(`/roles/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`);
                }}
              />
            </Col>
          )}
        </Row>
        <Form<IRoleForm>
          {...formItemLayout}
          form={form}
          name="rol"
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
                  name: "nombre",
                  label: "Rol Usuario",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
            </Col>
            <Col md={12} sm={24} xs={12}></Col>
            <Col md={12} sm={24} xs={12}>
              <SwitchInput
                name="activo"
                onChange={(value) => {
                  if (value) {
                    alerts.info(messages.confirmations.enable);
                  } else {
                    alerts.info(messages.confirmations.disable);
                  }
                }}
                label="Activo"
                readonly={CheckReadOnly()}
              />
            </Col>
          </Row>
        </Form>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Tag color="blue" style={{ fontSize: 14 }}>
            Tipo Usuario: {values.nombre}
          </Tag>
        </Row>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ width: "fit-content", margin: "auto" }}>
            <Transfer<IRolePermission>
              dataSource={values.permisos}
              showSearch
              onSearch={onSearch}
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
              onChange={onChange}
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

export default observer(RoleForm);
