import { Button, Col, Row, Form } from "antd";
import form from "antd/lib/form";
import { observer } from "mobx-react-lite";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
};

const SeriesTicket: FC<SeriesTicketProps> = ({ id }) => {
  const { seriesStore } = useStore();
  const { getById, createTicket, updateTicket, setSeriesType } = seriesStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<ITicketSerie>();
  const [values, setValues] = useState<ITicketSerie>(new TicketSeriesValues());

  useEffect(() => {
    const readSerie = async (serieId: number) => {
      setLoading(true);
      const serie = await getById(serieId);

      if (serie) {
        const ticket: ITicketSerie = {
          id: serieId,
          clave: serie.factura.clave,
          nombre: serie.factura.nombre,
          tipoSerie: 2,
        };
        setValues(ticket);
      }
      setLoading(false);
    };

    if (id) {
      readSerie(id);
    }
  }, [id, getById]);

  const goBack = () => {
    setSeriesType(0);
    navigate("/series");
  };

  const onFinish = async (newValues: ITicketSerie) => {
    setLoading(true);

    const serie = { ...values, ...newValues };
    serie.tipoSerie = 2;

    if (id) {
      await updateTicket(serie);
    } else {
      await createTicket(serie);
    }
    setLoading(false);
    goBack();
  };

  return (
    <Fragment>
      <Row>
        <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
          <Button onClick={goBack}>Cancelar</Button>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
      <Form<ITicketSerie>
        {...formItemLayout}
        form={form}
        name="seriesTicket"
        onFinish={onFinish}
        initialValues={values}
        scrollToFirstError
      >
        <Row>
          <Col md={8} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "clave",
                label: "Clave",
              }}
              required
            />
          </Col>
          <Col md={16} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "nombre",
                label: "Nombre",
              }}
              required
            />
          </Col>
          <Col span={8}>
            <SelectInput
              form={form}
              formProps={{ name: "tipoSerie", label: "Tipo" }}
              options={[{ value: 2, label: "Recibo" }]}
              required
              readonly={true}
            />
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default observer(SeriesTicket);
