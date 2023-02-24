import { Button, Col, Row, Form, Spin } from "antd";
import form from "antd/lib/form";
import { observer } from "mobx-react-lite";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import {
  ISeries,
  ITicketSerie,
  TicketSeriesValues,
} from "../../../../app/models/series";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";

type SeriesTicketProps = {
  id: number;
  tipoSerie: number;
};

const SeriesTicket: FC<SeriesTicketProps> = ({ id, tipoSerie }) => {
  const { seriesStore } = useStore();
  const { getById, createTicket, updateTicket, setSeriesType } = seriesStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [form] = Form.useForm<ITicketSerie>();
  const [values, setValues] = useState<ITicketSerie>(new TicketSeriesValues());

  useEffect(() => {
    const readSerie = async (serieId: number, tipo: number) => {
      setLoading(true);
      const serie = await getById(serieId, tipo);

      if (serie) {
        const ticket: ITicketSerie = {
          id: serieId,
          clave: serie.factura.clave,
          nombre: serie.factura.nombre,
          tipoSerie: 2,
        };
        setValues(ticket);
        form.setFieldsValue(ticket);
      }
      setLoading(false);
    };

    if (id) {
      readSerie(id, tipoSerie);
    }
  }, [id, getById]);

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    setSeriesType(0);
    navigate("/series");
  };

  const setEditMode = () => {
    navigate(`/series/${id}/${tipoSerie}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const onFinish = async (newValues: ITicketSerie) => {
    setLoading(true);

    const serie = { ...values, ...newValues };
    serie.tipoSerie = 2;

    let success = false;

    if (id) {
      success = await updateTicket(serie);
    } else {
      success = await createTicket(serie);
    }
    setLoading(false);

    if (success) {
      goBack();
    }
  };

  return (
    <Fragment>
      <Spin spinning={loading} tip={"Cargando"}>
        <Row gutter={[24, 12]}>
          {!readonly && (
            <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
              <Button onClick={goBack}>Cancelar</Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  form.submit();
                }}
              >
                Guardar
              </Button>
            </Col>
          )}
          {readonly && (
            <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={setEditMode}
              />
            </Col>
          )}
        </Row>
        <Form<ITicketSerie>
          {...formItemLayout}
          form={form}
          name="seriesTicket"
          onFinish={onFinish}
          initialValues={values}
          scrollToFirstError
        >
          <Row
            justify={"space-between"}
            gutter={[0, 12]}
            style={{ marginTop: 10 }}
          >
            <Col md={8} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "clave",
                  label: "Clave",
                }}
                required
                readonly={readonly}
              />
            </Col>
            <Col md={16} sm={24} xs={12}>
              <TextInput
                formProps={{
                  name: "nombre",
                  label: "Nombre",
                }}
                required
                readonly={readonly}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <SelectInput
                form={form}
                formProps={{ name: "tipoSerie", label: "Tipo" }}
                options={[{ value: 2, label: "Recibo" }]}
                required
                readonly={true}
              />
            </Col>
            <Col md={16}></Col>
          </Row>
        </Form>
      </Spin>
    </Fragment>
  );
};

export default observer(SeriesTicket);
