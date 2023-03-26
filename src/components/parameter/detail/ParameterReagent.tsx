import { Form, Row, Col, Button, Typography, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import TextInput from "../../../app/common/form/TextInput";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { IReagentList } from "../../../app/models/reagent";
import { store, useStore } from "../../../app/stores/store";
import { useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => any;
  selectedReagent: IReagentList[];
};

const ParameterReagent = ({ getResult, selectedReagent }: Props) => {
  const { reagentStore, parameterStore } = useStore();
  const { getAll, reagents } = reagentStore;
  const { setReagentSelected } = parameterStore;
  const { openModal, closeModal } = store.modalStore;
  const [form] = Form.useForm<any>();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedReagentKeys, setSelectedReagentKeys] =
    useState<IReagentList[]>(selectedReagent);

  useEffect(() => {
    const readReagents = async () => {
      setLoading(true);
      await getAll("all");
      setLoading(false);
    };

    readReagents();
  }, []);

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;
    await getAll(form.getFieldValue("search") ?? "all");
  };

  const columns: IColumns<IReagentList> = [
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
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("claveSistema", "Clave Contpaq", {
        searchState,
        setSearchState,
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const onSelectKeys = (item: IReagentList, checked: boolean) => {
    const index = selectedReagentKeys.findIndex((x) => x.id === item.id);
    if (checked && index === -1) {
      setSelectedReagentKeys((prev) => [...prev, item]);
    } else if (!checked && index > -1) {
      const newSelectedReagentKeys = [...selectedReagentKeys];
      newSelectedReagentKeys.splice(index, 1);
      setSelectedReagentKeys(newSelectedReagentKeys);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedReagentKeys.map((x) => x.id),
    onSelect: onSelectKeys,
  };

  useEffect(() => {}, [selectedReagentKeys]);

  const acceptChanges = () => {
    setReagentSelected(selectedReagentKeys);
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
            Favor de ingresar el nombre o clave del reactivo.
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
      <Table<IReagentList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...reagents]}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        rowSelection={rowSelection}
      />
      <Button type="primary" onClick={acceptChanges}>
        Aceptar
      </Button>
    </Fragment>
  );
};

export default observer(ParameterReagent);
