import {
  Button,
  Col,
  Divider,
  Form,
  PageHeader,
  Row,
  Tooltip,
  Transfer,
  Tree,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import TextInput from "../../app/common/form/proposal/TextInput";
import TextAreaInput from "../../app/common/form/proposal/TextAreaInput";
import { formItemLayout } from "../../app/util/utils";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useEffect, useState } from "react";
import { IDay } from "../../app/models/shared";
import { useStore } from "../../app/stores/store";
import { INotificationForm, NotificationValues } from "../../app/models/notifications";
import BranchesTransfer from "./BranchesTransfer";
import ImageButton from "../../app/common/button/ImageButton";
import views from "../../app/util/view";


const { Text } = Typography;
interface RecordType {
  key: string;
  title: string;
  description: string;
}
type UrlParams = {
  id: string;
};

const NotificationsDetail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { notificationsStore, optionStore } = useStore();

  const { getRoleOptions, roleOptions } = optionStore
  const [searchParams, setSearchParams] = useSearchParams();
  const { getById, create, update } = notificationsStore;
  const [selectedTags, setSelectedTags] = useState<IDay[]>([]);
  const [sucursales, setSucursales] = useState<string[]>([]);
  const [values, setValues] = useState<INotificationForm>(new NotificationValues());
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  let { id } = useParams<UrlParams>();
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [mockData, setMockData] = useState<RecordType[]>([]);
  useEffect(() => {
    const readrole = async () => {

      await getRoleOptions();
    }
    readrole();
  }, [getRoleOptions]);
  useEffect(() => {
    const readNotification = async () => {

      let notification = await getById(id!);
      notification!.fechas = [moment(notification!.fechas[0]), moment(notification!.fechas[1])]
      setValues(notification!);
      form.setFieldsValue(notification);
      setSucursales(notification!.sucursales);
      setSelectedTags(notification!.dias);
      let roles = [...notification!.roles]
      setTargetKeys(roles);
    }

    if (id) {

      readNotification();
    }
  }, [getById]);


  const [loading, setLoading] = useState(false);
  const onFinish = async (newValues: INotificationForm) => {
    setLoading(true);
    const notification = { ...values, ...newValues };
    notification.sucursales = sucursales;
    notification.dias = selectedTags;
    notification.roles= targetKeys;
    let success = false;
    if (!notification.id) {
      success = await create(notification);
    } else {
      success = await update(notification);
    }
    setLoading(false);

    if (success) {
      navigate(`/notifications?search=${searchParams.get("search") || "all"}&type=2`);
    }
  };
  const setEditMode = () => {
    searchParams.delete("mode");
    navigate(`/${views.notifications}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const handleChange = (tag: IDay, checked: Boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags!, tag]
      : selectedTags.filter((t) => t.id !== tag.id);
    setSelectedTags(nextSelectedTags!);
  };

  useEffect(() => {
    let roles = [...roleOptions]

    setMockData(roles.map(x => ({
      key: x.value?.toString()!,
      title: x.label?.toString()!,
      description: x.label?.toString()!,
    })))

  }, [roleOptions]);



  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };


  const tagsData: IDay[] = [
    { id: 1, dia: "L" },
    { id: 2, dia: "M" },
    { id: 3, dia: "M" },
    { id: 4, dia: "J" },
    { id: 5, dia: "V" },
    { id: 6, dia: "S" },
    { id: 7, dia: "D" },
  ];
  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeader
            ghost={false}
            title={<HeaderTitle title={`Crear notificación`} />}
            onBack={() => navigate(`/notifications?type=2`)}
            className="header-container"
            extra={[]}
          ></PageHeader>
        </Col>
      </Row>
      <Divider></Divider>
      <Row justify="end" style={{ marginBottom: 10 }}>
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              key="clean"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/notifications?type=2`)
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
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => setEditMode()}
            />
          </Col>
        )}
      </Row>

      <Form<INotificationForm>
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={values}

      >
        <Row gutter={[0, 12]}>
          <Col span={9}>
            <TextInput
              formProps={{
                name: "titulo",
                label: "Título",
              }}
              style={{ marginBottom: 10 }}
              readonly={readonly}
            />
          </Col>
          <Col span={9}>
            <DateRangeInput
              style={{ marginBottom: 10 }}
              formProps={{ label: "Periodo", name: "fechas" }}
              readonly={readonly}
            />
          </Col>
          <Col span={9}>

            <TextAreaInput
              formProps={{ name: "contenido", label: "Contenido" }}
              rows={5}
              readonly={readonly}
            ></TextAreaInput>
          </Col>
          <Col span={9}>
            <div style={{ marginLeft: "25%" }}>
              <span style={{ marginRight: 10 }}>Aplicar días:</span>
              {tagsData.map((tag) => (
                <CheckableTag
                  key={tag.id}
                  checked={
                    selectedTags.filter((x) => x.id === tag.id).length > 0
                  }
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag.dia}
                </CheckableTag>
              ))}
            </div>
          </Col>
        </Row>
        <Row justify="center" gutter={[100, 12]}>
          <Col span={10}>
            <Divider orientation="left">
              {" "}
              <Text>Roles</Text>
            </Divider>
            <Transfer<any>
              dataSource={mockData}
              titles={[
                <Tooltip title="Roles que pueden ser asignadas">
                  Disponibles
                </Tooltip>,
                <Tooltip title="Roles asignadas al tipo de usuario">
                  Agregadas
                </Tooltip>,
              ]}
              showSearch
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              render={(item) => item.title}
              listStyle={{
                width: 300,
                height: 300,
              }}
              style={{ justifyContent: "flex-end" }}
            />
          </Col>
          <Col span={10}>
            <Divider orientation="left">
              {" "}
              <Text>Sucursales</Text>
            </Divider>
            <BranchesTransfer
              id={id}
              sucursales={sucursales}
              setSucursales={setSucursales}
              sucursalesNotificacion={[...sucursales]}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default observer(NotificationsDetail);
