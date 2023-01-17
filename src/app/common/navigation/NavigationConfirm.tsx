import { Modal } from "antd";
import React from "react";

type NavigationConfirmProps = {
  showDialog: any;
  title: React.ReactNode;
  body: React.ReactNode;
  cancelNavigation: any;
  confirmNavigation: any;
};

const NavigationConfirm = ({
  showDialog,
  title,
  body,
  cancelNavigation,
  confirmNavigation,
}: NavigationConfirmProps) => {
  return (
    <Modal
      title={title}
      open={showDialog}
      onOk={cancelNavigation}
      okText="Seguir editando"
      okType="primary"
      onCancel={confirmNavigation}
      cancelText="Eliminar"
      closable={false}
      maskClosable={false}
    >
      {body}
    </Modal>
  );
};

export default NavigationConfirm;
