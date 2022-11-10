import { Drawer } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../../stores/store";

const DrawerComponent = () => {
  const { drawerStore } = useStore();
  const { drawer, closeDrawer } = drawerStore;

  const { visible, title, body, width } = drawer;

  return (
    <Drawer
      open={visible}
      title={title}
      width={width}
      placement="right"
      destroyOnClose={true}
      onClose={closeDrawer}
    >
      {body}
    </Drawer>
  );
};

export default observer(DrawerComponent);
