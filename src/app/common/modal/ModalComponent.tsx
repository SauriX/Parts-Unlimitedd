import { Modal } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../stores/store";

const ModalComponent = () => {
  const { modalStore } = useStore();
  const { modal, closeModal } = modalStore;

  const { visible, title, body, width, closable } = modal;

  return (
    <Modal
      key={"modal"}
      open={visible}
      title={title}
      width={width}
      closable={closable}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={closeModal}
      style={{ top: 64 }}
    >
      {body}
    </Modal>
  );
};

export default observer(ModalComponent);
