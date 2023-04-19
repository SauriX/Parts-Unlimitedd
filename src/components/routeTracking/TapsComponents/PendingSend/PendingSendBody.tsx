import { Spin } from "antd";
import React, { Fragment, useState } from "react";
import PendingSendTable from "./PendingSendTable";
import PendingSendFilter from "./PendingSendFilter";
import { observer } from "mobx-react-lite";

type PSDefaultProps = {
  printing: boolean;
};

const PendingSendBody = ({ printing }: PSDefaultProps) => {
  const [loading] = useState(false);

  return (
    <Fragment>
      <PendingSendFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <PendingSendTable />
      </Spin>
    </Fragment>
  );
};

export default observer(PendingSendBody);
