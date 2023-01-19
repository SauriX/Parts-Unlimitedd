import { Tabs } from "antd";
import React, { useState } from "react";
import { IRequestPayment } from "../../../../../app/models/request";
import { ITaxData } from "../../../../../app/models/taxdata";
import { useStore } from "../../../../../app/stores/store";
import DatosFiscalesForm from "../../../../proceedings/details/DatosFiscalesForm";
import RequestInvoiceDetail from "./RequestInvoiceDetail";

const { TabPane } = Tabs;

type RequestInvoiceTabProps = {
  recordId: string;
  requestId: string;
  branchId: string;
  payments: IRequestPayment[];
};

const RequestInvoiceTab = ({
  recordId,
  requestId,
  branchId,
  payments,
}: RequestInvoiceTabProps) => {
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

  const tabs = [
    {
      key: "taxData",
      label: "Datos Fiscales",
      children: (
        <DatosFiscalesForm
          local
          recordId={recordId}
          onSelectRow={onSelectTaxData}
        />
      ),
    },
    {
      key: "invoice",
      label: "Facturación",
      disabled: !taxData,
      children: (
        <RequestInvoiceDetail
          recordId={recordId}
          requestId={requestId}
          branchId={branchId}
          payments={payments}
          taxData={taxData!}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabs} />;
};

export default RequestInvoiceTab;
