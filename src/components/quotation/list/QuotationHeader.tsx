import { Button, PageHeader } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import views from "../../../app/util/view";

const QuotationHeader = () => {
  const navigate = useNavigate();

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo de Cotizaciones" />}
      className="header-container"
      extra={[
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate(`/${views.quotation}/new`);
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default QuotationHeader;
