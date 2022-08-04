import React, { useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";

const RequestPrintOrder = () => {
  const { requestStore } = useStore();
  const { request, getOrderPdfUrl } = requestStore;

  const [orderUrl, setOrderUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => {
      if (request) {
        const url = await getOrderPdfUrl(request.expedienteId, request.solicitudId!);
        setOrderUrl(url);
      }
    };

    getUrl();
  }, [getOrderPdfUrl, request]);

  return (
    <div>
      <object data={orderUrl} type="application/pdf" width="100%" height="600">
        alt : <a href={orderUrl}>test.pdf</a>
      </object>
    </div>
  );
};

export default RequestPrintOrder;
