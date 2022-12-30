import { Form, Row, Col, Button, Typography, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { store, useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { IOptions } from "../../../app/models/shared";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string, value: string) => any;
  id: string;
  tipo: string;
  selectedKeyObservation: IOptions[];
  modalValues: any;
};

const Observations = ({
  getResult,
  id,
  tipo,
  selectedKeyObservation,
  modalValues,
}: Props) => {
  const { clinicResultsStore } = useStore();
  const { setObservationsSelected } = clinicResultsStore;
  const [selectedObservation, setSelectedObservation] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<IOptions[]>([]);
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const { optionStore } = useStore();
  const { getTypeValues, typeValue } = optionStore;
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    getTypeValues(id, tipo);
  }, []);

  useEffect(() => {
    if (!!modalValues) {
      const keys = modalValues.split(",");
      const verifyKeys = typeValue.filter((x) => keys.includes(x.value));
      setSelectedKeys(verifyKeys);
    }
  }, [typeValue]);

  const columns: IColumns<IOptions> = [
    {
      ...getDefaultColumnProps("label", "Observación", {
        searchState,
        setSearchState,
        width: "100%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const onSelectChange = (
    item: IOptions,
    checked: boolean,
    selectedRows: IOptions[]
  ) => {
    const index = selectedKeys.findIndex((x) => x.value === item.value);
    if (checked && index === -1) {
      setSelectedKeys((prev) => [...prev, item]);
    } else if (!checked && index > -1) {
      const newSelectedReagentKeys = [...selectedKeys];
      newSelectedReagentKeys.splice(index, 1);
      setSelectedKeys(newSelectedReagentKeys);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedKeys.map((x) => x.value),
    onSelect: onSelectChange,
  };

  useEffect(() => {
    setSelectedObservation(
      selectedKeys.map((x) => x.label?.toString()).join("\r\n")
    );
    setSelectedValues(selectedKeys.map((x) => x.value).join(","));
  }, [selectedKeys]);

  const acceptChanges = () => {
    if (selectedObservation) {
      getResult(selectedObservation, selectedValues);
      setObservationsSelected(selectedKeys);
      setSelectedKeys([]);
    }
  };

  return (
    <Fragment>
      <Row gutter={[12, 12]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <PlusCircleOutlined style={{ color: "green", fontSize: 48 }} />
        </Col>
        <Col span={24}>
          <Paragraph style={{ textAlign: "center" }}>
            Favor de seleccionar una observación.
          </Paragraph>
        </Col>
      </Row>
      <Table
        loading={loading}
        size="small"
        rowKey={(record) => record.value}
        columns={columns}
        dataSource={[...typeValue]}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
      <br />
      <Button
        type="primary"
        onClick={acceptChanges}
        disabled={selectedObservation == null}
      >
        Aceptar
      </Button>
    </Fragment>
  );
};

export default observer(Observations);
