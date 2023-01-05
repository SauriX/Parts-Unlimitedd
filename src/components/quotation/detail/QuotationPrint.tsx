import React, { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";

const QuotationPrint = () => {
  const { quotationStore } = useStore();
  const { quotation, getQuotePdfUrl } = quotationStore;

  const [quoteUrl, setquoteUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => {
      if (quotation) {
        const url = await getQuotePdfUrl(quotation.cotizacionId);
        setquoteUrl(url);
      }
    };

    getUrl();
  }, [getQuotePdfUrl, quotation]);

  return (
    <div>
      <object data={quoteUrl} type="application/pdf" width="100%" height="600">
        alt : <a href={quoteUrl}>test.pdf</a>
      </object>
    </div>
  );
};

export default QuotationPrint;
