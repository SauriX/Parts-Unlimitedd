import { Button, Col, Form, Row, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { observer } from "mobx-react-lite";
import React from "react";
import { Fragment, useState } from "react";
import { ISamplingComment, IUpdate } from "../../app/models/sampling";
import { useStore } from "../../app/stores/store";
import alerts from "../../app/util/alerts";
import SamplingStudyColumns, {
  SamplingStudyExpandable,
} from "./columnDefinition/samplingStudy";
import SamplingStudyFilter from "./SamplingStudyFilter";
import SamplingStudyTable from "./SamplingStudyTable";

type RSDefaultProps = {
  printing: boolean;
};

const SamplingStudyBody = ({ printing }: RSDefaultProps) => {
  const { samplingStudyStore } = useStore();
  const { data, update, printOrder, getAll, formValues } = samplingStudyStore;

  const [form] = Form.useForm();

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
    const obs = form.getFieldsValue();
    console.log(obs);

    let observaciones: ISamplingComment[] = Object.keys(obs).map(x => ({id: parseInt(x), observacion: obs[x]}));

    let studyWithComments: IUpdate[] = updateForm.map(x => {
      return {
        ...x, observacion: observaciones.filter(y => x.estudioId.includes(y.id))
      }
    })

    setUpdateForm(studyWithComments)
    console.log(studyWithComments)

    setLoading(true);
    if (activity == "register") {
      alerts.confirm(
        "Estudio a Toma de Muestra",
        `Se enviará(n) ${
          updateForm.flatMap((x) => x.estudioId).length
        } estudio(s) de ${
          updateForm.length
        } solicitud(es) a estatus Toma de Muestra. ¿Deseas continuar?`,
        async () => {
          var success = await update(studyWithComments);
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
        "Estudio a Pendiente",
        `Se enviará(n) ${
          updateForm.flatMap((x) => x.estudioId).length
        } estudio(s) de ${
          updateForm.length
        } solicitud(es) a estatus Pendiente. ¿Deseas continuar?`,
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
    setUpdateForm([]);
    if (activity == "register") {
      setActivity("");
    }
  };

  const cancel = () => {
    setActivity("cancel");
    setUpdateForm([]);
    if (activity == "cancel") {
      setActivity("");
    }
  };

  return (
    <Fragment>
      <SamplingStudyFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Row justify="start" gutter={[0, 4]}>
              <Col span={8}>
                <Button
                  type={activity == "register" ? "primary" : "ghost"}
                  onClick={register}
                >
                  Registrar Toma
                </Button>
                <Button
                  type={activity == "cancel" ? "primary" : "ghost"}
                  onClick={cancel}
                >
                  Cancelar Toma
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
        <Form form={form}>
          <SamplingStudyTable
            data={data}
            columns={SamplingStudyColumns({ printOrder })}
            expandable={SamplingStudyExpandable({
              activity,
              onChange,
              updateForm
            })}
          />
        </Form>
      </Spin>
    </Fragment>
  );
};

export default observer(SamplingStudyBody);
