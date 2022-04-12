import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button } from "antd";
import React, { FC, useEffect, useMemo, useState, } from "react";
import { observer } from "mobx-react-lite";
import { IUserPermission, IUserForm,USerForm,IClave, claveValues} from "../../../app/models/user";
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
import { IRoleForm, RoleFormValues,IRolePermission } from "../../../app/models/role";
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
	const { getPermission,permisos,create,getById,getAll,roles,update } = roleStore;
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
  let role : IRoleForm = new RoleFormValues();
  useEffect(() => {
    setTargetKeys(values.permisos?.filter((x) => x.asignado).map((x) => x.id.toString()) ?? []);
  }, []);
  useEffect( () => {
		const readuser = async (idUser: string) => {
			setLoading(true);
			const user = await getById(idUser);
			form.setFieldsValue(user!);
      
			setValues(user!);
			setLoading(false);
		};

    const permission = async ()=>{

      await getPermission();

   
    }
		if (id) {
			readuser(id);
      
		}else{      
      permission();
    }
	}, [form,  getById, id ]);
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
  useEffect(() => {
    transform(permisos ?? []);
  }, [permisos, targetKeys, transform]);
  
  useEffect(() => {
    transform(values?.permisos ?? []);
  }, [values?.permisos, targetKeys, transform]);



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
  }, [ getAll , searchParams]);
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
    role,
    targetKeys,
    setSelectedKeys
  );

  const onFinish = async (newValues: IRoleForm) => {
		const User = { ...values, ...newValues };
  
    const permissions = permisos?.map((x) => ({
      ...x,asignado: targetKeys.includes(x.id.toString()), }));
      User.permisos = permissions;
      if (!User.permisos || User.permisos.filter((x) => x.asignado).length === 0 ) {
         alerts.warning(messages.emptyPermissions); return; 
        
      }


		let success = false;
		if (!User.id) {
			success = await create(User);
		} else {
			success = await update(User);
		}

		if (success) {
			navigate(`/roles?search=${searchParams.get("search")||"all"}`);
		}
	};
  const onDeselectParent = (key: string | number, children: DataNode[]) => {
    setSelectedKeys(selectedKeys.filter((x) => !children.map((y) => y.key).includes(x)));

  };
  const actualUser=()=>{
     if(id){
     const index= roles.findIndex(x=>x.id===id);
      return index+1;
    } 
    return 0;
  }
   const siguienteUser=(index:number)=>{
      console.log(id);
    const user = roles[index];
    
    navigate(`/roles/${user?.id}?mode=${searchParams.get("mode")}&search=${searchParams.get("search")??"all"}`);
  } 
  return (
    <Spin spinning={loading || load}>
      <div ref={componentRef}>
        <Row style={{ marginBottom: 24 }}>
        {id&&
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination size="small" total={roles.length} pageSize={1} current={actualUser()} onChange={(value)=>{siguienteUser(value-1)}}/>
          </Col>
          }
          { !CheckReadOnly() &&
                <Col md={24} sm={24} xs={24} style={id?{ textAlign: "right" }:{marginLeft:"80%"}}>
                  <Button  onClick={() => {navigate(`/roles`);}} >Cancelar</Button>
                    <Button type="primary" htmlType="submit" onClick={() => {form.submit()}}>
                      Guardar
                    </Button>
                </Col>
          }
          {
            CheckReadOnly() &&
              <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
                <ImageButton key="edit" title="Editar" image="editar" onClick={()=>{navigate(`/roles/${id}?mode=edit&search=${searchParams.get("search")??"all"}`);}}  />
              </Col>
          }
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
            <Col md={24} sm={24} xs={24}>
              <SwitchInput name="activo" label="Activo" readonly={CheckReadOnly()}/>
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
              dataSource={permisos}
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

export default observer(RoleForm);
