import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { IUser, IUserPermission, UserFormValues } from "../../../app/models/user";
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
import ImageButton from "../../../app/common/button/ImageButton";
type UserFormProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
type UrlParams = {
  id: string;
};

const UserForm: FC<UserFormProps> = ({ componentRef, printing }) => {
  const user: IUser = new UserFormValues();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [permissionsAdded, setPermissionsAdded] = useState<TreeData[]>([]);
  const [permissionsAvailable, setPermissionsAvailable] = useState<TreeData[]>([]);

  const [permissionsAddedFiltered, setPermissionsAddedFiltered] = useState<TreeData[]>([]);
  const [permissionsAvailableFiltered, setPermissionsAvailableFiltered] = useState<TreeData[]>([]);
  let navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setTargetKeys(user?.permisos?.filter((x) => x.asignado).map((x) => x.id.toString()) ?? []);
  }, []);

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

  const onSearch = onTreeSearch(
    setPermissionsAvailableFiltered,
    permissionsAvailable,
    setPermissionsAddedFiltered,
    permissionsAdded
  );

  const filterOption = (inputValue: string, option: IUserPermission) => {
    return (
      option.menu.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
      option.permiso.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };
  const CheckReadOnly =()=>{
    let result = false;
    const mode = searchParams.get("mode");
    if(mode == "ReadOnly"){
      result = true;
    }
    return result;
  }
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
  const { id } = useParams<UrlParams>();
  const userId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);
  const onDeselectParent = (key: string | number, children: DataNode[]) => {
    setSelectedKeys(selectedKeys.filter((x) => !children.map((y) => y.key).includes(x)));

  };
  return (
    <Spin spinning={loading || printing}>
      <div ref={componentRef}>
        <Row style={{ marginBottom: 24 }}>
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination size="small" total={50} pageSize={1} current={9} />
          </Col>
          { !CheckReadOnly() &&
              <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
                <Button  onClick={() => {}} >Cancelar</Button>
                  <Button type="primary" htmlType="submit" onClick={() => {navigate(`/users`);}}>
                    Guardar
                  </Button>
              </Col>
          }
          {
            CheckReadOnly() &&
              <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
                <ImageButton key="edit" title="Editar" image="edit" onClick={()=>{navigate(`/users/${userId}`);}}  />
              </Col>
          }
        </Row>
        <Form<IUser>
          {...formItemLayout}
          form={form}
          name="user"
          onFinish={() => {}}
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
                max={100}
                required
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
              <PasswordInput
                formProps={{
                  name: "contraseñaConfirmacion",
                  label: "Confirmar Contraseña",
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
              <SwitchInput name="activo" label="Activo" readonly={CheckReadOnly()}/>
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
              <SelectInput formProps={{ name: "sucursalId", label: "Sucursal" }} readonly={CheckReadOnly()} required options={[]} />
            </Col>
            <Col md={12} sm={24} xs={12}>
              <SelectInput
                formProps={{ name: "tipoUsuarioId", label: "Tipo de usuario" }}
                required
                options={[]}
                readonly={CheckReadOnly()}
              />
            </Col>
          </Row>
        </Form>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Tag color="blue" style={{ fontSize: 14 }}>
            Usuario: Miguel Farías
          </Tag>
        </Row>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ width: "fit-content", margin: "auto" }}>
            <Transfer<IUserPermission>
              dataSource={[]}
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
                    // checkable={!readonly}
                    // disabled={readonly}
                    height={200}
                    onCheck={(_, { node: { key, children, checked } }) => {
                      if (children && children.length > 0 && checked) {
                        onDeselectParent(key, children);
                      } else {
                        onItemSelect(key.toString(), !checked);
                      }
                      setDisabled(false);
                    }}
                    onSelect={(_, { node: { key, checked, children } }) => {
                      if (children && children.length > 0 && checked) {
                        onDeselectParent(key, children);
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

export default UserForm;
