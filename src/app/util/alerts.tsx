import { ExclamationCircleOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
const { confirm, info } = Modal;

const alerts = {
  success(text: string) {
    message.success({ content: text, duration: 7 });
  },
  info(text: string) {
    message.info({ content: text, duration: 7 });
  },
  warning(text: string) {
    message.warning({ content: text, duration: 7 });
  },
  error(text: string) {
    message.error({ content: text, duration: 7 });
  },
  confirm(
    title: string,
    text: React.ReactNode,
    onOk: () => Promise<void>,
    onCancel?: () => void,
    okText: string | null = null,
    cancelText: string | null = null
  ) {
    confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content: text,
      onOk() {
        return onOk();
      },
      onCancel() {
        onCancel && onCancel();
      },
      okText: okText || "Aceptar",
      cancelText: cancelText || "Cancelar",
    });
  },
  confirmInfo(
    title: string,
    text: React.ReactNode,
    onOk: () => Promise<void>,
    okText: string | null = null
  ) {
    info({
      title,
      icon: <ExclamationCircleOutlined />,
      content: text,
      onOk() {
        return onOk();
      },
      okText: okText || "Volver",
    });
  },
};

export default alerts;
