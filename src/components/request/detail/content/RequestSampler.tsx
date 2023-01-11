import { Table, Spin, Row, Col, Button } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useState } from "react";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import {
  IRequestStudy,
  IRequestStudyUpdate,
} from "../../../../app/models/request";
import { useStore } from "../../../../app/stores/store";
import { status } from "../../../../app/util/catalogs";

const RequestSampler = () => {
  const { requestStore } = useStore();
  const { request, allStudies, sendStudiesToSampling, getStudies } =
    requestStore;

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
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("dias", "Días", {
        searchable: false,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaTomaMuestra", "Fecha toma", {
        searchable: false,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaEntrega", "Fecha de entrega", {
        searchable: false,
        width: "15%",
      }),
      render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
    },
    Table.SELECTION_COLUMN,
  ];

  const updateStudies = async () => {
    if (request) {
      const data: IRequestStudyUpdate = {
        expedienteId: request.expedienteId,
        solicitudId: request.solicitudId!,
        estudios: selectedStudies,
      };

      setLoading(true);
      const ok = await sendStudiesToSampling(data);
      if (ok) {
        setSelectedStudies([]);
        getStudies(request.expedienteId, request.solicitudId!);
      }
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="default"
            disabled={
              selectedStudies.length === 0 ||
              !selectedStudies.every(
                (x) => x.estatusId === status.requestStudy.tomaDeMuestra
              )
            }
            onClick={updateStudies}
          >
            Cancelar
          </Button>
          <Button
            type="default"
            disabled={
              selectedStudies.length === 0 ||
              !selectedStudies.every(
                (x) => x.estatusId === status.requestStudy.pendiente
              )
            }
            onClick={updateStudies}
          >
            Toma de muestra
          </Button>
        </Col>
        <Col span={24}>
          <Table<IRequestStudy>
            size="small"
            rowKey={(record) => record.id ?? record.identificador!}
            columns={columns}
            dataSource={[...allStudies]}
            pagination={false}
            rowSelection={{
              fixed: "right",
              onChange(_selectedRowKeys, selectedRows, _info) {
                setSelectedStudies(toJS(selectedRows));
              },
              getCheckboxProps: (record) => ({
                disabled:
                  (record.estatusId !== status.requestStudy.pendiente &&
                    record.estatusId !== status.requestStudy.tomaDeMuestra) ||
                  !record.asignado,
              }),
              selectedRowKeys: selectedStudies.map(
                (x) => x.id ?? x.identificador!
              ),
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
