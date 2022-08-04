import { Table, Spin, Row, Col, Button } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ISearch, IColumns, getDefaultColumnProps } from "../../../app/common/table/utils";
import { IRequestStudy, IRequestStudyUpdate } from "../../../app/models/request";
import { useStore } from "../../../app/stores/store";
import { status } from "../../../app/util/catalogs";

const RequestSampler = () => {
  const { requestStore, modalStore } = useStore();
  const { request, allStudies, sendStudiesToSampling } = requestStore;

  const [selectedStudies, setSelectedStudies] = useState<IRequestStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IRequestStudy> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 75,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: 175,
      }),
    },
    {
      ...getDefaultColumnProps("estatusId", "Estatus", {
        searchState,
        setSearchState,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("dias", "Días", {
        searchable: false,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchable: false,
        width: 125,
      }),
    },
    Table.SELECTION_COLUMN,
  ];

  const updateStudies = () => {
    if (request) {
      const data: IRequestStudyUpdate = {
        expedienteId: request.expedienteId,
        solicitudId: request.solicitudId!,
        estudios: selectedStudies,
      };
      sendStudiesToSampling(data);
    }
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="default"
            disabled={!selectedStudies.some((x) => x.estatusId === status.requests.pendiente)}
            onClick={updateStudies}
          >
            Toma de muestra
          </Button>
        </Col>
        <Col span={24}>
          <Table<IRequestStudy>
            size="small"
            rowKey={(record) => record.estudioId}
            columns={columns}
            dataSource={[...allStudies]}
            pagination={false}
            rowSelection={{
              fixed: "right",
              onChange(selectedRowKeys, selectedRows, info) {
                setSelectedStudies(toJS(selectedRows));
              },
              getCheckboxProps: (record) => ({
                disabled: record.estatusId !== status.requests.pendiente,
              }),
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RequestSampler);
