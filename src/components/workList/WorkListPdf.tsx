import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";

const WorkListPdf = () => {
  const { workListStore } = useStore();
  const { filter, getWorkListPdfUrl } = workListStore;

  const [workListUrl, setOrderUrl] = useState<string>();

  useEffect(() => {
    const getUrl = async () => {
      if (
        filter.sucursales.length > 0 &&
        filter.area != null &&
        filter.fecha != null &&
        filter.horaInicio != null &&
        filter.horaFin != null
      ) {
        const url = await getWorkListPdfUrl(filter);
        setOrderUrl(url);
      }
    };

    getUrl();
  }, [filter, getWorkListPdfUrl]);

  return (
    <div style={{ marginTop: 10 }}>
      <object
        data={workListUrl}
        type="application/pdf"
        width="100%"
        height="700"
      >
        alt : <a href={workListUrl}>test.pdf</a>
      </object>
    </div>
  );
};

export default observer(WorkListPdf);
