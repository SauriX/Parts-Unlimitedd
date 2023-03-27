import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ProceedingHeader from "../components/proceedings/ProceedingHeader";
import ProceedingTable from "../components/proceedings/ProceedingTable";

const Proceeding = () => {
  const { procedingStore, generalStore } = useStore();
  const { exportList } = procedingStore;
  const { generalFilter } = generalStore;

  const [loading, setLoading] = useState(false);

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });

  const handleDownload = async () => {
    setLoading(true);
    await exportList(generalFilter);
    setLoading(false);
  };

  return (
    <Fragment>
      <ProceedingHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <ProceedingTable componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(Proceeding);
