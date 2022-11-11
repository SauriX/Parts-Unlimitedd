import { Form, Row, Col, Button, Typography, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import TextInput from "../../../../app/common/form/TextInput";
import { ExclamationCircleOutlined, SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { IReagentList } from "../../../../app/models/reagent";
import { store, useStore } from "../../../../app/stores/store";
import { useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IParameterList } from "../../../../app/models/parameter";
import { VList } from "virtual-table-ant-design";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => any;
  selectedReagent: React.Key[];
};

const ParameterReagent = ({ getResult, selectedReagent }: Props) => {
  const { reagentStore, parameterStore,studyStore } = useStore();
  const { getAll, parameters } = parameterStore;
  const { setParameterSelected,getParameterSelected } = studyStore;
  const { openModal, closeModal } = store.modalStore;
  const [form] = Form.useForm<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSelectedRowKeys(selectedReagent);
  }, []);

  useEffect(() => {
    const readReagents = async () => {
      setLoading(true);
      await getAll("all");
      setLoading(false);
    };

    if (parameters.length === 0) {
      readReagents();
    }
  }, []);

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;
    await getAll(form.getFieldValue("search") ?? "all");
    setSearchParams(searchParams);
  };

  const columns: IColumns<IParameterList> = [
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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const acceptChanges = () => {
    const filterList = parameters.filter((x) =>
      selectedRowKeys.includes(x.id)
    );
    setParameterSelected(filterList);
    closeModal();
  }

  return (
    <Fragment>
      <Row gutter={[12, 12]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <PlusCircleOutlined
            style={{ color: "green", fontSize: 48 }}
          />
        </Col>
        <Col span={24}>
          <Paragraph style={{textAlign: "center"}}>
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
      <Table<IParameterList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...parameters]}
        sticky
        scroll={{ y: '30vh', x: true }}
        components={VList({
          height: 500,
        })}
        rowSelection={rowSelection}
      />
      <Button
        type="primary"
        onClick={acceptChanges}
        style={{marginLeft:"90%"}}
      >
        Aceptar
      </Button>
    </Fragment>
  );
};

export default observer(ParameterReagent);
