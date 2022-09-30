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
  IRequestStudy,
  IRequestStudyUpdate,
} from "../../../../app/models/request";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { catalog, status } from "../../../../app/util/catalogs";

type RequestSamplerProps = {
  formGeneral: FormInstance<IRequestGeneral>;
};

const RequestSampler = ({ formGeneral }: RequestSamplerProps) => {
  const { requestStore, modalStore } = useStore();
  const { request, allStudies, setStudy, sendStudiesToSampling } = requestStore;

  const [selectedStudies, setSelectedStudies] = useState<IRequestStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const updateDate = (item: IRequestStudy, value: moment.Moment | null) => {
    if (value) {
      setStudy({ ...item, fechaEntrega: value.utcOffset(0, true) });
      const origin = formGeneral.getFieldValue("urgencia");
      if (origin === catalog.urgency.normal) {
        alerts.info("La solicitud se marcará como urgente");
        formGeneral.setFieldValue("urgencia", catalog.urgency.urgente);
        formGeneral.submit();
      }
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
      await sendStudiesToSampling(data);
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
              !selectedStudies.some(
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
                disabled: record.estatusId !== status.requestStudy.pendiente,
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
