import { PageHeader, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Text } = Typography;

const QuotationHeader = () => {
  const { quotationStore } = useStore();
  const { quotation } = quotationStore;

  let navigate = useNavigate();

  const getBack = () => {
    navigate(`/${views.quotation}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Cotización" />}
      onBack={getBack}
      className="header-container"
      extra={[
        <Text key="quotation">
          Cotización: <Text strong>{quotation?.clave}</Text>
        </Text>,
        <Text key="number">
          Registro: <Text strong>{quotation?.registro}</Text>
        </Text>,
      ]}
    ></PageHeader>
  );
};

export default observer(QuotationHeader);
