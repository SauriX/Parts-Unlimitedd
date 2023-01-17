import { Form, Row, Col, Button, Typography, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import TextInput from "../../../../app/common/form/TextInput";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { store, useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import useWindowDimensions from "../../../../app/util/window";
import { VList } from "virtual-table-ant-design";
import { IEstudiosList } from "../../../../app/models/trackingOrder";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => any;
  selectedStudys: IEstudiosList[];
};

const StudyTable = ({ getResult, selectedStudys }: Props) => {
  const {  studyStore } = useStore();

  const { openModal, closeModal } = store.modalStore;
  const [form] = Form.useForm<any>();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedParameterKeys, setSelectedParameterKeys] =
    useState<IEstudiosList[]>(selectedStudys);

  useEffect(() => {
    const readReagents = async () => {
      setLoading(true);
    //  await getAll("all");
      setLoading(false);
    };
    readReagents();
  }, []);

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;
   // await getAll(form.getFieldValue("search") ?? "all");
  };

  const columns: IColumns<IEstudiosList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "50%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const onSelectKeys = (item: IEstudiosList, checked: boolean) => {
    const index = selectedParameterKeys.findIndex((x) => x.id === item.id);
    if (checked && index === -1) {
      setSelectedParameterKeys((prev) => [...prev, item]);
    } else if (!checked && index > -1) {
      const newSelectedParameterKeys = [...selectedParameterKeys];
      newSelectedParameterKeys.splice(index, 1);
      setSelectedParameterKeys(newSelectedParameterKeys);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedParameterKeys.map((x) => x.id),
    onSelect: onSelectKeys,
  };
  
  useEffect(() => {
    console.log(selectedParameterKeys);
  }, [selectedParameterKeys]);

  const acceptChanges = () => {
    //setStudyselected(selectedParameterKeys);
    closeModal();
  };

  return (
    <Fragment>
      <Row gutter={[12, 12]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <PlusCircleOutlined style={{ color: "green", fontSize: 48 }} />
        </Col>
        <Col span={24}>
          <Paragraph style={{ textAlign: "center" }}>
            Favor de ingresar el nombre o clave del parámetro.
          </Paragraph>
        </Col>
        <Col span={24}>
          <Form<any>
            form={form}
            name="searchReagent"
            className="login-form"
            onFinish={search}
          >
            <Row gutter={[12, 12]}>
              <Col md={12} xs={24}>
                <TextInput
                  formProps={{ name: "search" }}
                  max={200}
                  placeholder="Nombre / Clave"
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit">
                  Buscar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Table<IEstudiosList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[]}
        sticky
        scroll={{ y: "30vh", x: true }}
        components={VList({
          height: 500,
        })}
        //rowSelection={rowSelection}
      />
      <Button
        type="primary"
        onClick={() => acceptChanges()}
        style={{ marginLeft: "90%" }}
      >
        Aceptar
      </Button>
    </Fragment>
  );
};

export default observer(StudyTable);
