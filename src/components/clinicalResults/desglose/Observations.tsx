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

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string) => any;
};

const ParameterReagent = ({ getResult }: Props) => {
  const [form] = Form.useForm<any>();
  const [selectedObservation, setSelectedObservation] = useState<string>();
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const observations: IObservations[] = [
    {
      id: 0,
      observacion:
        "Se recomienda no consumir ningún tipo de líquido por lo menos 2 horas entre medicamentos.",
    },
    {
      id: 1,
      observacion:
        "Se recomienda reposo durante 5 días y tomar mucho líquido, preferentemente agua natural.",
    },
    {
      id: 2,
      observacion:
        "Se recomienda no consumir ningún alimento alto en grasas o derivados de animales.",
    },
  ];

  const columns: IColumns<IObservations> = [
    {
      ...getDefaultColumnProps("observacion", "Observación", {
        searchState,
        setSearchState,
        width: "100%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const onSelectChange = (item: IObservations) => {
    setSelectedObservation(item.observacion);
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
      <Table<IObservations>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...observations]}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
      />
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
