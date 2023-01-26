import React, { FC, Fragment } from "react";
import { useStore } from "../../../app/stores/store";
import SeriesInvoice from "./type/SeriesInvoice";
import SeriesTicket from "./type/SeriesTicket";

type SeriesFormProps = {
  id: number;
};

const SeriesForm: FC<SeriesFormProps> = ({ id }) => {
  const { seriesStore } = useStore();
  const { seriesType } = seriesStore;

  return (
    <Fragment>
      {seriesType === 1 ? <SeriesInvoice id={id} /> : <SeriesTicket id={id} />}
    </Fragment>
  );
};

export default SeriesForm;
