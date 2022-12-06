import { Button, Col, Row, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { observer } from "mobx-react-lite";
import React from "react";
import { Fragment, useState } from "react";
import { IUpdate } from "../../app/models/requestedStudy";
import { useStore } from "../../app/stores/store";
import alerts from "../../app/util/alerts";
import RequestedStudyColumns, {
  RequestedStudyExpandable,
} from "./columnDefinition/requestedStudy";
import RequestedStudyFilter from "./RequestedStudyFilter";
import RequestedStudyTable from "./RequestedStudyTable";

type RSDefaultProps = {
  printing: boolean;
};

const RequestedStudyBody = ({ printing }: RSDefaultProps) => {
  const { requestedStudyStore } = useStore();
  const { data, update, printOrder, getAll, formValues } = requestedStudyStore;
  const [updateForm, setUpdateForm] = useState<IUpdate[]>([]);
  const [activity, setActivity] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: CheckboxChangeEvent, id: number, solicitud: string) => {
    const index = updateForm.findIndex((x) => x.solicitudId == solicitud);
    if (e.target.checked) {
      if (index > -1) {
        const request = { ...updateForm[index] };
        if (!request.estudioId.includes(id)) {
          request.estudioId.push(id);
        }
        setUpdateForm((prev) => [
          ...prev.filter((x) => x.solicitudId != solicitud),
          request,
        ]);
      } else {
        const request = { solicitudId: solicitud, estudioId: [id] };
        setUpdateForm((prev) => [...prev, request]);
      }
    } else {
      if (index > -1) {
        const request = { ...updateForm[index] };
        request.estudioId = request.estudioId.filter((x) => x != id);
        if (request.estudioId.length === 0) {
          setUpdateForm((prev) =>
            prev.filter((x) => x.solicitudId != solicitud)
          );
        } else {
          setUpdateForm((prev) => [
            ...prev.filter((x) => x.solicitudId != solicitud),
            request,
          ]);
        }
      }
    }
  };

  const updateData = async () => {
    setLoading(true);
    if (activity == "register") {
      alerts.confirm(
        "Estudio a Solicitado",
        `Se enviará(n) ${
          updateForm.flatMap((x) => x.estudioId).length
        } estudio(s) de ${
          updateForm.length
        } solicitud(es) a estatus Solicitado. ¿Deseas continuar?`,
        async () => {
          var success = await update(updateForm!);
          if (success) {
            setLoading(false);
            setUpdateForm([]);
            setActivity("");
            getAll(formValues);
          }
        },
        async () => {
          setLoading(false);
        }
      );
    } else {
      alerts.confirm(
        "Estudio a Toma de Muestra",
        `Se enviará(n)  ${
          updateForm.flatMap((x) => x.estudioId).length
        } estudio(s) de ${
          updateForm.length
        } solicitud(es) a estatus Toma de Muestra. ¿Deseas continuar?`,
        async () => {
          var success = await update(updateForm!);
          if (success) {
            setLoading(false);
            setUpdateForm([]);
            setActivity("");
            getAll(formValues);
          }
        },
        async () => {
          setLoading(false);
        }
      );
    }
    setLoading(false);
  };

  const register = () => {
    setActivity("register");
    if (activity == "register") {
      setActivity("");
    }
  };

  const cancel = () => {
    setActivity("cancel");
    if (activity == "cancel") {
      setActivity("");
    }
  };

  return (
    <Fragment>
      <RequestedStudyFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Row justify="start" gutter={[0, 4]}>
              <Col span={8}>
                <Button
                  type={activity == "register" ? "primary" : "ghost"}
                  onClick={register}
                >
                  Solicitar Estudio
                </Button>
                <Button
                  type={activity == "cancel" ? "primary" : "ghost"}
                  onClick={cancel}
                >
                  Cancelar Solicitud
                </Button>
              </Col>
              {activity == "register" ? (
                <Col span={8} style={{ textAlign: "right" }} offset={8}>
                  <Button
                    type="primary"
                    disabled={updateForm.length <= 0}
                    onClick={() => {
                      updateData();
                    }}
                  >
                    Aceptar Registro
                  </Button>
                </Col>
              ) : (
                ""
              )}
              {activity == "cancel" ? (
                <Col span={8} style={{ textAlign: "right" }} offset={8}>
                  <Button
                    type="primary"
                    disabled={updateForm.length <= 0}
                    onClick={() => {
                      updateData();
                    }}
                  >
                    Cancelar Registro
                  </Button>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Col>
        </Row>
        <RequestedStudyTable
          data={data}
          columns={RequestedStudyColumns({ printOrder })}
          expandable={RequestedStudyExpandable({
            activity,
            onChange,
          })}
        />
      </Spin>
    </Fragment>
  );
};

export default observer(RequestedStudyBody);
