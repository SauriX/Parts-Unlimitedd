import { Spin } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import SeriesColumns from "../columnDefinition/series";
import SeriesFilter from "./SeriesFilter";
import SeriesTable from "./SeriesTable";

type SeriesBodyProps = {
  printing: boolean;
};

const SeriesBody: FC<SeriesBodyProps> = ({ printing }) => {
  const { seriesStore } = useStore();
  const { seriesList, getByFilter, setSeriesType } = seriesStore;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const readRequests = async () => {
      await getByFilter({
        año: moment(Date.now()).utcOffset(0, true),
      });
      setSeriesType(0);
    };

    readRequests();
  }, []);

  return (
    <Fragment>
      <SeriesFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <SeriesTable series={seriesList} columns={SeriesColumns()} />
      </Spin>
    </Fragment>
  );
};

export default observer(SeriesBody);
