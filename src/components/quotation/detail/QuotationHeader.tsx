import { PageHeader, Pagination, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Text } = Typography;

const QuotationHeader = () => {
  const { quotationStore } = useStore();
  const { quotation, quotations, filter, getQuotations } = quotationStore;

  let navigate = useNavigate();

  const { quotationId } = useParams();

  useEffect(() => {
    if (
      quotations.length === 0 ||
      quotations.findIndex((x) => x.cotizacionId === quotationId) === -1
    ) {
      getQuotations(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationId]);

  const getPage = (id?: string) => {
    return quotations.findIndex((x) => x.cotizacionId === id) + 1;
  };

  const setPage = (page: number) => {
    const quotation = quotations[page - 1];
    navigate(`/${views.quotation}/${quotation.cotizacionId}`);
  };

  const getBack = () => {
    navigate(`/${views.quotation}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Cotización" />}
      onBack={getBack}
      className="header-container"
      subTitle={
        <Pagination
          size="small"
          total={quotations.length}
          pageSize={1}
          current={getPage(quotation?.cotizacionId)}
          onChange={setPage}
        />
      }
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
