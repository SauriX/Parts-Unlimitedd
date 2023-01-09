import { Col, Space, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../app/stores/store";
import IndicatorFilter from "./IndicatorFilter";
import IndicatorsTable from "./IndicatorsTable";

type IndicatorsProps = {
  printing: boolean;
};

const IndicatorsBody = ({ printing }: IndicatorsProps) => {
  const [loading, setLoading] = useState(false);
  const { indicatorsStore } = useStore();
  const { data } = indicatorsStore;

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
