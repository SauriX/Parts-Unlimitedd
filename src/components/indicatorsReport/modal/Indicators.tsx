import { Typography, Spin, Tabs, Divider } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import "../css/indicators.less";
import IndicatorsModalFilter from "./IndicatorsModalFilter";
import CostosToma from "./CostosToma";
import { titleTab } from "../columnDefinition/indicators";
import CostosFijos from "./CostosFijos";
import IndicatorModalHeader from "./IndicatorModalHeader";
import moment from "moment";

type Props = {
  getResult: (isAdmin: string) => any;
};

const Indicators = ({ getResult }: Props) => {
  const { indicatorsStore } = useStore();
  const {
    samples,
    services,
    exportSamplingList,
    exportServiceList,
    modalFilter,
    getSamplesCostsByFilter,
    getServicesCost,
    servicesCost,
    setServicesCost,
    loadingReport
  } = indicatorsStore;
  const [loading, setLoading] = useState(false);

  const [modalTab, setModalTab] = useState("sample");

  const items = titleTab.map((x, i) => {
    return {
      label: x.label,
      key: x.name,
      children: (
        <Fragment>
          <IndicatorsModalFilter modalTab={modalTab} />
          <Spin spinning={loading}>
            {modalTab === "sample" && (
              <CostosToma samples={samples} loading={loadingReport} />
            )}
            {modalTab === "service" && (
              <CostosFijos data={services} loading={loadingReport} />
            )}
          </Spin>
        </Fragment>
      ),
    };
  });

  useEffect(() => {
    if (modalTab === "sample") {
      getSamplesCostsByFilter({
        fecha: [
          moment(Date.now()).utcOffset(0, true),
          moment(Date.now()).utcOffset(0, true),
        ],
      });
    } else if (modalTab === "service") {
      getServicesCost({
        fecha: [
          moment(Date.now()).utcOffset(0, true),
          moment(Date.now()).utcOffset(0, true),
        ],
      });
    }
  }, [modalTab]);

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
      await exportSamplingList(modalFilter);
    } else if (modalTab === "service") {
      await exportServiceList(modalFilter);
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
