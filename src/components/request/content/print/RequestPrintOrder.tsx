import React, { useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";

const RequestPrintOrder = () => {
  const { requestStore } = useStore();
  const { getOrderPdfUrl } = requestStore;

  const [orderUrl, setOrderUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => {
      const url = await getOrderPdfUrl();
      setOrderUrl(url);
    };

    getUrl();
  }, [getOrderPdfUrl]);

  return (
    <div>
      <object data={orderUrl} type="application/pdf" width="100%" height="600">
        alt : <a href={orderUrl}>test.pdf</a>
      </object>
    </div>
  );
};

export default RequestPrintOrder;
