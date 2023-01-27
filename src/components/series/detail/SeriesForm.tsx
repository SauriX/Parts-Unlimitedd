import { observer } from "mobx-react-lite";
import React, { FC, Fragment } from "react";
import { useStore } from "../../../app/stores/store";
import SeriesInvoice from "./type/SeriesInvoice";
import SeriesTicket from "./type/SeriesTicket";

type SeriesFormProps = {
  id: number;
  tipoSerie: number;
};

const SeriesForm: FC<SeriesFormProps> = ({ id, tipoSerie }) => {
  const { seriesStore } = useStore();
  const { seriesType } = seriesStore;

  return (
    <Fragment>
      {seriesType === 1 || tipoSerie === 1 ? (
        <SeriesInvoice id={id} tipoSerie={tipoSerie} />
      ) : (
        <SeriesTicket id={id} tipoSerie={tipoSerie} />
      )}
    </Fragment>
  );
};

export default observer(SeriesForm);
