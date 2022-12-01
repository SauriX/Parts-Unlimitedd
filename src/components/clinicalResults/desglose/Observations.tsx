import { Form, Row, Col, Button, Typography, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import TextInput from "../../../app/common/form/TextInput";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { IReagentList } from "../../../app/models/reagent";
import { IObservations, ItipoValorForm } from "../../../app/models/parameter";
import { store, useStore } from "../../../app/stores/store";
import { useSearchParams } from "react-router-dom";
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
  getResult: (isAdmin: string) => any;
  id: string;
  tipo: string;
};

const ParameterReagent = ({ getResult, id, tipo }: Props) => {
  const [form] = Form.useForm<any>();
  const [selectedObservation, setSelectedObservation] = useState<string>();
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

  const onSelectChange = (item: IOptions, checked: boolean, selectedRows: IOptions[]) => {
    setSelectedObservation(selectedRows.map(x => x.label?.toString()).join("\r\n"));
  };

  const rowSelection = {
    onSelect: onSelectChange,
  };

  const acceptChanges = () => {
    if (selectedObservation) {
      getResult(selectedObservation);
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

export default observer(ParameterReagent);
