import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";
import PendingReceiveFilter from "./PendingReceiveFilter";
import { Spin } from "antd";
import PendingReceiveTable from "./PendingReceiveTable";
import { useStore } from "../../../../app/stores/store";

type PSDefaultProps = {
  printing: boolean;
};

const PendingReceiveBody = ({ printing }: PSDefaultProps) => {
  const { routeTrackingStore } = useStore();
  
  const [loading] = useState(false);


  return (
    <Fragment>
      <PendingReceiveFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <PendingReceiveTable />
      </Spin>
    </Fragment>
  );
};

export default observer(PendingReceiveBody);
