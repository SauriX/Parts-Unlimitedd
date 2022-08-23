import { Table, Spin, Row, Col, Button, DatePicker } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { isMoment } from "moment";
import { useState } from "react";
import { ISearch, IColumns, getDefaultColumnProps } from "../../../../app/common/table/utils";
import { IRequestPartiality, IRequestStudy, IRequestStudyUpdate } from "../../../../app/models/request";
import { useStore } from "../../../../app/stores/store";
import { status } from "../../../../app/util/catalogs";

const RequestRequest = () => {
  const { requestStore, modalStore } = useStore();
  const { request, allStudies, setStudy, setPartiality, addPartiality, sendStudiesToRequest } = requestStore;

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
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("dias", "Días", {
        searchable: false,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaEntrega", "Fecha", {
        searchable: false,
        width: "25%",
      }),
      render: (value, item) => {
        return (
          <DatePicker
            bordered={false}
            value={value ? (isMoment(value) ? value : moment(value)) : moment()}
            format="DD/MM/YYYY HH:mm"
            minuteStep={5}
            showTime
            allowClear={false}
            onChange={(value) => {
              if (value) setStudy({ ...item, fechaEntrega: value.utcOffset(0, true) });
            }}
          />
        );
      },
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
      sendStudiesToRequest(data);
    }
  };

  const updatePartiality = async () => {
    if (request) {
      const data: IRequestPartiality = {
        expedienteId: request.expedienteId,
        solicitudId: request.solicitudId!,
        aplicar: !request.parcialidad,
      };
      const ok = await addPartiality(data);
      if (ok) {
        setPartiality(data.aplicar);
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={updatePartiality}>
            {request?.parcialidad ? "Aplicar parcialidad" : "Cancelar parcialidad"}
          </Button>
          <Button
            type="default"
            disabled={!selectedStudies.some((x) => x.estatusId === status.requestStudy.tomaDeMuestra)}
            onClick={updateStudies}
          >
            Solicitar estudio
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
                disabled: record.estatusId !== status.requestStudy.tomaDeMuestra,
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

export default observer(RequestRequest);
