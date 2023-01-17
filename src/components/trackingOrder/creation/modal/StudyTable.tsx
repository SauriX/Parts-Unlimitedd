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
  const { studyStore } = useStore();
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<any[]>([]);
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
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("estudio", "Estudio  ", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("Estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("dias", "Dias", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchState,
        setSearchState,
        width: "20%",
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
    type: "checkbox",
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
      <Button type="primary"  style={{marginBottom:19,marginLeft:"94%"}} onClick={acceptChanges}>
        Agregar
      </Button>

      <Table<any>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[]}
        sticky
        className="header-expandable-table"
        scroll={{ y: "30vh", x: true }}
        components={VList({
          height: 500,
        })}
        rowSelection={{
          type: "checkbox",
/*           getCheckboxProps: (record: any) => ({
            disabled: !record.isActiveCheckbox,
          }), */
          onSelect: (selectedRow, isSelected, a: any) => {
           
          },
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: any,
            rowSelectedMethod: any
          ) => {
            
          },
          selectedRowKeys: selectedRowKeysCheck,
        }}
      />
    </Fragment>
  );
};

export default observer(StudyTable);
