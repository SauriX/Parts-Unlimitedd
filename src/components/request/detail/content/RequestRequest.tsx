import { Table, Spin, Row, Col, Button, DatePicker, FormInstance } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { isMoment } from "moment";
import { useState } from "react";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import {
  IRequestGeneral,
  IRequestPartiality,
  IRequestStudy,
  IRequestStudyUpdate,
} from "../../../../app/models/request";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { catalog, status } from "../../../../app/util/catalogs";

type RequestRequestProps = {
  formGeneral: FormInstance<IRequestGeneral>;
};

const RequestRequest = ({ formGeneral }: RequestRequestProps) => {
  const { requestStore } = useStore();
  const {
    request,
    allStudies,
    setStudy,
    setPartiality,
    addPartiality,
    sendStudiesToRequest,
  } = requestStore;

  const [selectedStudies, setSelectedStudies] = useState<IRequestStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const updateDate = (item: IRequestStudy, value: moment.Moment | null) => {
    if (!value) {
      alerts.warning("Por favor selecciona una fecha");
      return;
    }

    if (value.isBefore(moment())) {
      alerts.warning("No es posible seleccionar una fecha anterior");
      return;
    }

    setStudy({ ...item, fechaEntrega: value.utcOffset(0, true) });
    const origin = formGeneral.getFieldValue("urgencia");
    if (origin === catalog.urgency.normal) {
      alerts.info("La solicitud se marcará como urgente");
      formGeneral.setFieldValue("urgencia", catalog.urgency.urgente);
      formGeneral.submit();
    }
  };

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
              updateDate(item, value);
            }}
            disabledDate={(current) =>
              current.isBefore(moment())
            }
          />
        );
      },
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
      const ok = await sendStudiesToRequest(data);
      if (ok) setSelectedStudies([]);
      setLoading(false);
    }
  };

  const updatePartiality = async () => {
    if (request) {
      const data: IRequestPartiality = {
        expedienteId: request.expedienteId,
        solicitudId: request.solicitudId!,
        aplicar: !request.parcialidad,
      };
      setLoading(true);
      const ok = await addPartiality(data);
      setLoading(false);
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
            {!request?.parcialidad
              ? "Aplicar parcialidad"
              : "Cancelar parcialidad"}
          </Button>
          <Button
            type="default"
            disabled={
              !selectedStudies.some(
                (x) => x.estatusId === status.requestStudy.solicitado
              )
            }
            onClick={updateStudies}
          >
            Cancelar
          </Button>
          <Button
            type="default"
            disabled={
              !selectedStudies.some(
                (x) => x.estatusId === status.requestStudy.tomaDeMuestra
              )
            }
            onClick={updateStudies}
          >
            Solicitar estudio
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
              onChange(selectedRowKeys, selectedRows, info) {
                setSelectedStudies(toJS(selectedRows));
              },
              getCheckboxProps: (record) => ({
                disabled:
                  record.estatusId !== status.requestStudy.tomaDeMuestra && record.estatusId !== status.requestStudy.solicitado,
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

export default observer(RequestRequest);
