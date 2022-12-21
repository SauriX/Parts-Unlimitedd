import { Form, Typography, Spin, Tabs } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { ISearch } from "../../../app/common/table/utils";
import "../css/indicators.less";
import IndicatorsModalFilter from "./IndicatorsModalFilter";
import CostosToma from "./CostosToma";
import { titleTab } from "../columnDefinition/indicators";
import CostosFijos from "./CostosFijos";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: string) => any;
};

const Indicators = ({ getResult }: Props) => {
  const { optionStore, indicatorsStore } = useStore();
  const { data, indicatorsData } = indicatorsStore;
  const [loading, setLoading] = useState(false);

  const [modalTab, setModalTab] = useState("sample");

  const items = titleTab.map((x) => {
    return {
      label: x.label,
      key: x.name,
      children: (
        <Fragment>
          <IndicatorsModalFilter modalTab={modalTab} />
          <Spin spinning={loading}>
            {modalTab === "sample" && (
              <CostosToma data={data} costoToma={0} loading={loading} />
            )}
            {modalTab === "service" && (
              <CostosFijos data={data} costoFijo={0} loading={loading} invoiceData={indicatorsData.costosFijosInvoice} />
            )}
          </Spin>
        </Fragment>
      ),
    };
  });

  const onChange = (key: string) => {
    if(key === "sample") {
      setModalTab("sample")
    } else if (key === "service") {
      setModalTab("service")
    }
  };

  return <Tabs type="card" items={items} onChange={onChange} />;
};

export default observer(Indicators);
