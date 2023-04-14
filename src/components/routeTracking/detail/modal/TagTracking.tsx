import {
  Button,
  Col,
  Divider,
  Form,
  PageHeader,
  Row,
  Table,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
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
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { v4 as uuid } from "uuid";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string) => any;
  selectedTags: ITagTrackingOrder[];
  requestCode: string;
};

const TagTracking = ({ getResult, selectedTags, requestCode }: Props) => {
  const { routeTrackingStore } = useStore();
  const { closeModal } = store.modalStore;
  const {
    setTagsSelected,
    tags,
    tagData,
    getAllTags,
    loadingRoutes,
    routeStudies,
    getStudyTrackingOrder,
  } = routeTrackingStore;

  const [form] = Form.useForm<any>();
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const [selectedTagKeys, setSelectedTagKeys] =
    useState<ITagTrackingOrder[]>(selectedTags);

  useEffect(() => {
    const readTags = async () => {
      await getAllTags(requestCode ?? "all");
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
        width: "25%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("recipiente", "Recipiente", {
        searchState,
        setSearchState,
        width: "25%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchState,
        setSearchState,
        width: "25%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("solicitud", "Solicitud", {
        searchState,
        setSearchState,
        width: "25%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const onSelectKeys = (item: ITagTrackingOrder, checked: boolean) => {
    const index = selectedTagKeys.findIndex((x) => x.id === item.id);
    let routeCode = tagData.find((x) => x.claveRuta)?.claveRuta;
    item.escaneo = true;
    item.extra = true;
    item.claveRuta = routeCode ?? "";

    let study = getStudyTrackingOrder(item);

    if (checked && index === -1) {
      setSelectedTagKeys((prev) => [...prev, item]);
      selectedTags.push(item);
      tagData.push(item);
      routeStudies.push(study);
    } else if (!checked && index > -1) {
      const newSelectedTagKeys = [...selectedTagKeys];
      newSelectedTagKeys.splice(index, 1);
      setSelectedTagKeys(newSelectedTagKeys);
      routeStudies.splice(routeStudies.indexOf(study), 1);
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
      <PageHeader
        ghost={false}
        title={
          <HeaderTitle
            title={`Agregar etiquetas manualemnte`}
            image="etiquetas"
          />
        }
        className="header-container"
      ></PageHeader>
      <Divider className="header-divider"></Divider>
      <Paragraph>
        Favor de ingresar la clave de una solicitud o una etiqueta.
      </Paragraph>
      <Row gutter={[12, 12]}>
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
        loading={loadingRoutes}
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
