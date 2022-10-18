import { Spin } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";

const WorkListPdf = () => {
  const { workListStore } = useStore();
  const { filter, getWorkListPdfUrl } = workListStore;

  const [workListUrl, setOrderUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUrl = async () => {
      if (
        filter.sucursales.length > 0 &&
        filter.areaId != null &&
        filter.fecha != null &&
        filter.horaInicio != null &&
        filter.horaFin != null
      ) {
        setLoading(true);
        const url = await getWorkListPdfUrl(filter);
        setOrderUrl(url);
        setLoading(false);
      }
    };

    getUrl();
  }, [filter, getWorkListPdfUrl]);

  return (
    <div style={{ marginTop: 10 }}>
      <Spin spinning={loading}>
        <object
          data={workListUrl}
          type="application/pdf"
          width="100%"
          height="700"
        >
          alt : <a href={workListUrl}>test.pdf</a>
        </object>
      </Spin>
    </div>
  );
};

export default observer(WorkListPdf);
