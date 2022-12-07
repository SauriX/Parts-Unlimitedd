import {
  Button,
  Col,
  Divider,
  Form,
  PageHeader,
  Row,
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
import { useNavigate } from "react-router-dom";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useState } from "react";
import { IDias } from "../../app/models/promotion";

const { Text } = Typography;

const NotificationsDetail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState<IDias[]>([]);

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const handleChange = (tag: IDias, checked: Boolean) => {
    //console.log(tag, "el tag");
    const nextSelectedTags = checked
      ? [...selectedTags!, tag]
      : selectedTags.filter((t) => t.id !== tag.id);
    //console.log("You are interested in: ", nextSelectedTags);
    setSelectedTags(nextSelectedTags!);
  };
  const tagsData: IDias[] = [
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
            onBack={() => navigate(`/notifications`)}
            className="header-container"
            extra={[]}
          ></PageHeader>
        </Col>
      </Row>
      <Divider></Divider>
      <Row justify="end" style={{ marginBottom: 10 }}>
        <Col>
          <Button
            key="clean"
            onClick={(e) => {
              e.stopPropagation();
              //   limpiaFormulario();
            }}
          >
            Cancelar
          </Button>
          ,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              //   form.submit();
            }}
          >
            Guardar
          </Button>
        </Col>
      </Row>

      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        size="small"
        initialValues={{ fechas: [moment(), moment()], tipoFecha: 1 }}
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "titulo",
                label: "Título",
              }}
              style={{ marginBottom: 10 }}
            />
            <TextAreaInput
              formProps={{ name: "contenido", label: "Contenido" }}
              rows={5}
            ></TextAreaInput>
          </Col>
          <Col span={8}>
            <DateRangeInput
              style={{ marginBottom: 10 }}
              formProps={{ label: "Periodo", name: "periodo" }}
            />
            <div style={{ marginLeft: "135px" }}>
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
              dataSource={[]}
              showSearch
              style={{ justifyContent: "flex-end" }}
              listStyle={{
                width: 300,
                height: 300,
              }}
              targetKeys={[]}
              onChange={() => {}}
              render={(item) => item.title}
            >
              {({ direction, onItemSelect, selectedKeys, filteredItems }) => {
                // const data =
                //   direction === "left"
                //     ? permissionsAvailableFiltered
                //     : permissionsAddedFiltered;
                const checkedKeys = [...selectedKeys];
                return (
                  <Tree
                    virtual={false}
                    // checkable={!CheckReadOnly()}
                    // disabled={CheckReadOnly()}
                    height={200}
                    onCheck={(_, { node: { key, children, checked } }) => {}}
                    onSelect={(_, { node: { key, checked, children } }) => {}}
                    treeData={[]}
                    showIcon
                    checkedKeys={checkedKeys}
                  />
                );
              }}
            </Transfer>
          </Col>
          <Col span={10}>
            <Divider orientation="left">
              {" "}
              <Text>Sucursales</Text>
            </Divider>
            <Transfer<any> //cambiar tipo
              dataSource={[]}
              showSearch
              style={{ justifyContent: "flex-end" }}
              listStyle={{
                width: 300,
                height: 300,
              }}
              targetKeys={[]}
              onChange={() => {}}
              render={(item) => item.title}
            >
              {({ direction, onItemSelect, selectedKeys, filteredItems }) => {
                // const data =
                //   direction === "left"
                //     ? permissionsAvailableFiltered
                //     : permissionsAddedFiltered;
                const checkedKeys = [...selectedKeys];
                return (
                  <Tree
                    virtual={false}
                    // checkable={!CheckReadOnly()}
                    // disabled={CheckReadOnly()}
                    height={200}
                    onCheck={(_, { node: { key, children, checked } }) => {}}
                    onSelect={(_, { node: { key, checked, children } }) => {}}
                    treeData={[]}
                    showIcon
                    checkedKeys={checkedKeys}
                  />
                );
              }}
            </Transfer>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default observer(NotificationsDetail);
