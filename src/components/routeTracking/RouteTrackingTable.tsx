import { Tabs, TabsProps } from "antd";
import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import PendingSendBody from "./TapsComponents/PendingSend/PendingSendBody";
import PendingReceiveBody from "./TapsComponents/PendingReceive/PendingReceiveBody";

type RTDefaultProps = {
  printing: boolean;
};

const RouteTrackingTable = ({ printing }: RTDefaultProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Pendientes de enviar",
      children: <PendingSendBody printing={printing} />,
    },
    {
      key: "2",
      label: "Pendientes de recibir",
      children: <PendingReceiveBody printing={printing} />,
    },
  ];

  return (
    <Fragment>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </Fragment>
  );
};

export default observer(RouteTrackingTable);
