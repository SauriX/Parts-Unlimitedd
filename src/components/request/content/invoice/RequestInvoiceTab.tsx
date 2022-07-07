import { Tabs } from "antd";
import React, { useState } from "react";
import { ITaxData } from "../../../../app/models/taxdata";
import { useStore } from "../../../../app/stores/store";
import DatosFiscalesForm from "../../../proceedings/details/DatosFiscalesForm";
import RequestInvoiceDetail from "./RequestInvoiceDetail";

const { TabPane } = Tabs;

type RequestInvoiceTabProps = {
  recordId: string;
};

const RequestInvoiceTab = ({ recordId }: RequestInvoiceTabProps) => {
  const { modalStore } = useStore();
  const { setTitle } = modalStore;

  const [taxData, setTaxData] = useState<ITaxData>();

  const onTabChange = (activeKey: string) => {
    if (activeKey === "taxData") {
      setTitle("Datos Fiscales");
    } else {
      setTitle(`Realizar Factura RFC: ${taxData!.rfc}`);
    }
  };

  const onSelectTaxData = (taxData: ITaxData) => {
    setTaxData(taxData);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={onTabChange}>
      <TabPane tab="Datos Fiscales" key="taxData">
        <DatosFiscalesForm local recordId={recordId} onSelectRow={onSelectTaxData} />
      </TabPane>
      <TabPane tab="Facturación" key="invoice" disabled={!taxData}>
        <RequestInvoiceDetail />
      </TabPane>
    </Tabs>
  );
};

export default RequestInvoiceTab;
