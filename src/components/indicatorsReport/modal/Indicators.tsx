import { Typography, Spin, Tabs, Divider } from "antd";
import { Fragment, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import "../css/indicators.less";
import IndicatorsModalFilter from "./IndicatorsModalFilter";
import CostosToma from "./CostosToma";
import { titleTab } from "../columnDefinition/indicators";
import CostosFijos from "./CostosFijos";
import IndicatorModalHeader from "./IndicatorModalHeader";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string) => any;
};

const Indicators = ({ getResult }: Props) => {
  const { indicatorsStore } = useStore();
  const { samples, services, exportSamplingList, exportServiceList, filter } =
    indicatorsStore;
  const [loading, setLoading] = useState(false);

  const [modalTab, setModalTab] = useState("sample");

  // let defaultSampleCost = samples[0].costoToma;
  // let defaultServiceCost = services[0].costoFijo;

  const items = titleTab.map((x) => {
    return {
      label: x.label,
      key: x.name,
      children: (
        <Fragment>
          <IndicatorsModalFilter modalTab={modalTab} />
          <Spin spinning={loading}>
            {modalTab === "sample" && (
              <CostosToma
                samples={samples}
                costoToma={0}
                loading={loading}
              />
            )}
            {modalTab === "service" && (
              <CostosFijos
                data={services}
                costoFijo={0}
                loading={loading}
              />
            )}
          </Spin>
        </Fragment>
      ),
    };
  });

  const onChange = (key: string) => {
    if (key === "sample") {
      setModalTab("sample");
    } else if (key === "service") {
      setModalTab("service");
    }
  };

  const handleList = async () => {
    setLoading(true);
    if (modalTab === "sample") {
      await exportSamplingList(filter);
    } else if (modalTab === "service") {
      await exportServiceList(filter);
    }
    setLoading(false);
  };

  return (
    <Fragment>
      <IndicatorModalHeader handleList={handleList} />
      <Divider></Divider>
      <Tabs type="card" items={items} onChange={onChange} />
    </Fragment>
  );
};

export default observer(Indicators);
