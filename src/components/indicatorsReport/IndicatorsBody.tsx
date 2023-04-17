import { Col, Space, Spin } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import IndicatorFilter from "./IndicatorFilter";
import IndicatorsTable from "./IndicatorsTable";

type IndicatorsProps = {
  printing: boolean;
};

const IndicatorsBody = ({ printing }: IndicatorsProps) => {
  const [loading, setLoading] = useState(false);
  const { indicatorsStore } = useStore();
  const { data, getByFilter } = indicatorsStore;

  useEffect(() => {
    const readRequests = async () => {
      await getByFilter({
        fechaIndividual: moment(),
        sucursalId: [],
        fechaInicial: moment(),
        fechaFinal: moment(),
        tipoFecha: "date",
      });
    };

    readRequests();
  }, []);

  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Col span={24}>
        <IndicatorFilter />
      </Col>
      <br />
      <Col span={24}>
        <IndicatorsTable data={data} />
      </Col>
    </Spin>
  );
};

export default observer(IndicatorsBody);
