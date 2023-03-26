import { Spin } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";

const QuotationPrint = () => {
  const { quotationStore } = useStore();
  const { quotation, totals, getQuotationPdf } = quotationStore;

  const [quotationUrl, setQuotationUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUrl = async () => {
      if (quotation) {
        setLoading(true);
        const url = await getQuotationPdf(quotation.cotizacionId);
        setQuotationUrl(url);
        setLoading(false);
      }
    };

    getUrl();
  }, [getQuotationPdf, quotation, totals]);

  return (
    <Spin spinning={loading}>
      <object
        data={quotationUrl}
        type="application/pdf"
        width="100%"
        height="600"
      >
        alt : <a href={quotationUrl}>test.pdf</a>
      </object>
    </Spin>
  );
};

export default observer(QuotationPrint);
