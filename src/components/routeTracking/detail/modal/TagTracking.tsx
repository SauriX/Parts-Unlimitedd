import { Button, Col, Form, Row, Table, Typography } from "antd";
import search from "antd/lib/transfer/search";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import TextInput from "../../../../app/common/form/TextInput";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { ITagTrackingOrder } from "../../../../app/models/routeTracking";
import { store, useStore } from "../../../../app/stores/store";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string) => any;
  selectedTags: ITagTrackingOrder[];
};

const TagTracking = ({ getResult, selectedTags }: Props) => {
  const { routeTrackingStore } = useStore();
  const { closeModal } = store.modalStore;
  const { setTagsSelected, tags, getAllTags } = routeTrackingStore;
  const [form] = Form.useForm<any>();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedTagKeys, setSelectedTagKeys] =
    useState<ITagTrackingOrder[]>(selectedTags);

  useEffect(() => {
    const readTags = async () => {
      setLoading(true);
      await getAllTags("all");
      setLoading(false);
    };

    readTags();
  }, []);

  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;
    await getAllTags(form.getFieldValue("search") ?? "all");
  };

  const columns: IColumns<ITagTrackingOrder> = [
    {
      ...getDefaultColumnProps("claveEtiqueta", "Clave muestra", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("recipiente", "Recipiente", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
  ];

  const onSelectKeys = (item: ITagTrackingOrder, checked: boolean) => {
    const index = selectedTagKeys.findIndex((x) => x.id === item.id);
    if (checked && index === -1) {
      setSelectedTagKeys((prev) => [...prev, item]);
    } else if (!checked && index > -1) {
      const newSelectedTagKeys = [...selectedTagKeys];
      newSelectedTagKeys.splice(index, 1);
      setSelectedTagKeys(newSelectedTagKeys);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedTagKeys.map((x) => x.id),
    onSelect: onSelectKeys,
  };

  const acceptChanges = () => {
    setTagsSelected(selectedTagKeys);
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
            Favor de ingresar la clave de una solicitud.
          </Paragraph>
        </Col>
        <Col span={24}>
          <Form<any>
            form={form}
            name="searchRecord"
            className="login-form"
            onFinish={search}
          >
            <Row gutter={[12, 12]}>
              <Col md={12} xs={24}>
                <TextInput
                  formProps={{ name: "search" }}
                  max={200}
                  placeholder="Clave"
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
      <Table<ITagTrackingOrder>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...tags]}
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

export default observer(TagTracking);
